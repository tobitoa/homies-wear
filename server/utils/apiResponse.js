export function successResponse(res, data = {}, statusCode = 200, meta = null) {
  const payload = {
    success: true,
    data,
  };
  if (meta) {
    payload.meta = meta;
  }
  return res.status(statusCode).json(payload);
}

export function errorResponse(
  res,
  message = "An error occurred",
  statusCode = 500,
  errors = null,
) {
  const payload = {
    success: false,
    message,
  };
  if (errors && process.env.NODE_ENV !== "production") {
    payload.errors = errors;
  }
  return res.status(statusCode).json(payload);
}
