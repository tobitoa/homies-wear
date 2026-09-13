import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import { config } from "./env.js";
import { logger } from "../utils/logger.js";

let memoryServer = null;

export async function connectDB() {
  try {
    // Attempt standard connection with 3s timeout
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    const safeUri = config.mongoUri.replace(/:\/\/[^@]+@/, "://***@");
    logger.info(`MongoDB connected to ${safeUri}`);
  } catch (err) {
    logger.warn(
      `Could not connect to external MongoDB at ${config.mongoUri} (${err.message}).`,
    );

    // In dev/test environment, fallback to mongodb-memory-server if available
    try {
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      logger.info("Starting embedded MongoDB instance for seamless local execution...");

      const dbDir = path.resolve(process.cwd(), "server/.data/db");
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      memoryServer = await MongoMemoryServer.create({
        instance: {
          dbName: "homies-wear",
          dbPath: dbDir,
          storageEngine: "wiredTiger",
        },
      });
      const uri = memoryServer.getUri();
      await mongoose.connect(uri);
      logger.info(`Connected to embedded MongoDB at ${uri} (persisted at ${dbDir})`);
    } catch (memErr) {
      logger.error("Failed to start embedded MongoDB:", memErr.message);
      throw err;
    }
  }

  mongoose.connection.on("error", (err) => {
    logger.error("MongoDB connection error:", err.message);
  });

  mongoose.connection.on("disconnected", () => {
    logger.warn("MongoDB disconnected");
  });
}

export async function disconnectDB() {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
}
