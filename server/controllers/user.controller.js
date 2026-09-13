import * as userService from "../services/user.service.js";
import { successResponse } from "../utils/apiResponse.js";

export async function getProfile(req, res, next) {
  try {
    const profile = await userService.getUserProfile(req.params.id);
    return successResponse(res, profile, 200);
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const profile = await userService.updateUserProfile(req.user._id, req.body);
    return successResponse(res, profile, 200);
  } catch (err) {
    next(err);
  }
}
