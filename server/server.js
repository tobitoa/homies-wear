import http from "http";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config/env.js";
import { connectDB, disconnectDB } from "./config/db.js";
import { logger } from "./utils/logger.js";
import { globalLimiter } from "./middleware/rateLimiter.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";
import apiRouter from "./routes/index.js";
import { initSocketIO } from "./sockets/socketHandler.js";

const app = express();
const httpServer = http.createServer(app);

// Security Headers
app.use(helmet());

// CORS Configuration
app.use(
  cors({
    origin: [config.clientOrigin, "http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Body Parsers & Rate Limiting
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(globalLimiter);

// API Routes
app.use("/api", apiRouter);

// 404 Handler for undefined routes
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found.",
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Initialize Realtime Socket.IO
initSocketIO(httpServer);

// Server Startup
async function startServer() {
  try {
    await connectDB();

    const { ClothingItem } = await import("./models/index.js");
    const count = await ClothingItem.countDocuments();
    if (count === 0) {
      logger.info(
        "No clothing items found in database. Initializing starter community data...",
      );
      const { seedData } = await import("./seeds/seed.js");
      await seedData(false);
    }

    httpServer.listen(config.port, () => {
      logger.info(`Homies Wear API running at http://localhost:${config.port}`);
      logger.info(`Environment: ${config.nodeEnv}`);
    });
  } catch (err) {
    logger.error("Fatal startup error:", err.message);
    process.exit(1);
  }
}

// Graceful Shutdown
const handleShutdown = async (signal) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  httpServer.close(async () => {
    try {
      await disconnectDB();
      logger.info("Database disconnected. Server closed cleanly.");
      process.exit(0);
    } catch (err) {
      logger.error("Error during shutdown:", err.message);
      process.exit(1);
    }
  });
};

process.on("SIGTERM", () => handleShutdown("SIGTERM"));
process.on("SIGINT", () => handleShutdown("SIGINT"));

startServer();

export { app, httpServer };
