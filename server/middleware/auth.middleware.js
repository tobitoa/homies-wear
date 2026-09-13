import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import { User } from "../models/index.js";
import { ApiError } from "../utils/apiError.js";

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw ApiError.unauthorized("Authentication token is missing.");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw ApiError.unauthorized("Authentication token is missing.");
    }

    let decoded;
    try {
      decoded = jwt.verify(token, config.jwtSecret);
    } catch (jwtErr) {
      if (jwtErr.name === "TokenExpiredError") {
        throw ApiError.unauthorized("Your session has expired. Please log in again.");
      }
      throw ApiError.unauthorized("Invalid authentication token.");
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      throw ApiError.unauthorized("User account no longer exists.");
    }

    req.user = user;
    req.auth = { id: user._id.toString(), role: user.role };
    next();
  } catch (err) {
    next(err);
  }
}

export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      if (token) {
        try {
          const decoded = jwt.verify(token, config.jwtSecret);
          const user = await User.findById(decoded.id);
          if (user) {
            req.user = user;
            req.auth = { id: user._id.toString(), role: user.role };
          }
        } catch {
          // Ignore invalid optional tokens
        }
      }
    }
    next();
  } catch {
    next();
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return next(ApiError.forbidden("Admin access required."));
  }
  next();
}
