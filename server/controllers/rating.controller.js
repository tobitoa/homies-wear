import * as ratingService from "../services/rating.service.js";
import { successResponse } from "../utils/apiResponse.js";

export async function createRating(req, res, next) {
  try {
    const rating = await ratingService.createSwapRating(req.user._id, req.body);
    return successResponse(res, rating, 201);
  } catch (err) {
    next(err);
  }
}

export async function getUserRatings(req, res, next) {
  try {
    const ratings = await ratingService.getUserRatings(req.params.userId);
    return successResponse(res, ratings, 200);
  } catch (err) {
    next(err);
  }
}
