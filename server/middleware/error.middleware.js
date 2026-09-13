import { logger } from "../utils/logger.js";
import { errorResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

export function errorHandler(err, req, res, _next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong. Please try again.";
  let errors = err.errors || null;

  // Handle Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid format for resource identifier: ${err.path}`;
  }

  // Handle Mongoose ValidationError
  if (err.name === "ValidationError") {
    statusCode = 400;
    const messages = Object.values(err.errors).map((e) => e.message);
    message = messages[0] || "Invalid submission data.";
    errors = messages;
  }

  // Handle MongoDB duplicate key error (code 11000)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    message = `A record with this ${field} already exists.`;
  }

  // Handle JsonWebToken errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid authentication token.";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Your session has expired. Please log in again.";
  }

  // Log error with context
  if (statusCode >= 500) {
    logger.error(
      `[500 Error] ${req.method} ${req.originalUrl}:`,
      err.stack || err.message,
    );
    message = "An unexpected server error occurred. Please try again later.";
  } else {
    logger.warn(`[${statusCode}] ${req.method} ${req.originalUrl}:`, message);
  }

  return errorResponse(res, message, statusCode, errors);
}
