export class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(msg = "Bad request", errors = null) {
    return new ApiError(400, msg, true, errors);
  }

  static unauthorized(msg = "Authentication required") {
    return new ApiError(401, msg);
  }

  static forbidden(msg = "You do not have permission to perform this action") {
    return new ApiError(403, msg);
  }

  static notFound(msg = "Resource not found") {
    return new ApiError(404, msg);
  }

  static conflict(msg = "Resource conflict") {
    return new ApiError(409, msg);
  }

  static unprocessable(msg = "Unprocessable entity", errors = null) {
    return new ApiError(422, msg, true, errors);
  }

  static internal(msg = "Internal server error") {
    return new ApiError(500, msg, false);
  }
}
