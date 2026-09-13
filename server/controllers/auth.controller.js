import * as authService from "../services/auth.service.js";
import { successResponse } from "../utils/apiResponse.js";

export async function register(req, res, next) {
  try {
    const result = await authService.registerUser(req.body);
    return successResponse(res, result, 201);
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const result = await authService.loginUser(req.body);
    return successResponse(res, result, 200);
  } catch (err) {
    next(err);
  }
}

export async function getMe(req, res, next) {
  try {
    const user = await authService.getMe(req.user._id);
    return successResponse(res, { user }, 200);
  } catch (err) {
    next(err);
  }
}

export async function logout(_req, res) {
  return successResponse(res, { message: "Successfully logged out." }, 200);
}
