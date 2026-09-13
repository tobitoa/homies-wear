import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import { logger } from "../utils/logger.js";
import { Conversation } from "../models/index.js";
import * as conversationService from "../services/conversation.service.js";
import { setSocketEmitter } from "../services/notification.service.js";

let ioInstance = null;

export function initSocketIO(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: [config.clientOrigin, "http://localhost:5173", "http://127.0.0.1:5173"],
      credentials: true,
      methods: ["GET", "POST"],
    },
    pingTimeout: 60000,
  });

  ioInstance = io;

  // Set socket emitter for notifications
  setSocketEmitter((userId, event, data) => {
    io.to(`user:${userId}`).emit(event, data);
  });

  // Socket Auth Middleware
  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.replace("Bearer ", "");

    if (!token) {
      return next(new Error("Authentication token required for realtime connection"));
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      return next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.userId;
    logger.info(`User connected to socket: ${userId} (socket ID: ${socket.id})`);

    // Join user personal notification room
    socket.join(`user:${userId}`);

    // Join a conversation room
    socket.on("join_conversation", async ({ conversationId }) => {
      try {
        if (!conversationId) return;
        const conv = await Conversation.findById(conversationId);
        if (!conv) return;

        const isParticipant = conv.participants.some(
          (p) => p.toString() === userId.toString(),
        );
        if (!isParticipant) {
          socket.emit("error", {
            message: "Not authorized to join this conversation room.",
          });
          return;
        }

        socket.join(`conversation:${conversationId}`);
        logger.info(`User ${userId} joined room conversation:${conversationId}`);
      } catch (err) {
        logger.error("Error joining conversation:", err.message);
      }
    });

    // Leave a conversation room
    socket.on("leave_conversation", ({ conversationId }) => {
      if (conversationId) {
        socket.leave(`conversation:${conversationId}`);
      }
    });

    // Send realtime message
    socket.on(
      "send_message",
      async ({ conversationId, text, type, swapData }, callback) => {
        try {
          const message = await conversationService.sendMessage(userId, conversationId, {
            text,
            type,
            swapData,
          });

          // Broadcast message to everyone in the conversation
          io.to(`conversation:${conversationId}`).emit("new_message", message);

          if (typeof callback === "function") {
            callback({ success: true, message });
          }
        } catch (err) {
          logger.error("Error sending socket message:", err.message);
          if (typeof callback === "function") {
            callback({ success: false, message: err.message });
          }
        }
      },
    );

    // Typing indicators
    socket.on("typing_start", ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit("user_typing", {
        userId,
        conversationId,
        isTyping: true,
      });
    });

    socket.on("typing_stop", ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit("user_typing", {
        userId,
        conversationId,
        isTyping: false,
      });
    });

    socket.on("disconnect", () => {
      logger.info(`User disconnected from socket: ${userId}`);
    });
  });

  return io;
}

export function emitToUser(userId, event, data) {
  if (ioInstance) {
    ioInstance.to(`user:${userId}`).emit(event, data);
  }
}

export function emitToConversation(conversationId, event, data) {
  if (ioInstance) {
    ioInstance.to(`conversation:${conversationId}`).emit(event, data);
  }
}
