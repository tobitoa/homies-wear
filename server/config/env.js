import "dotenv/config";

export const config = {
  port: parseInt(process.env.PORT || "4000", 10),
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/homies-wear",
  jwtSecret:
    process.env.JWT_SECRET || "homies-wear-super-secure-production-jwt-secret-key-2026",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  nodeEnv: process.env.NODE_ENV || "development",
};
