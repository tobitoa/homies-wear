import * as favoriteService from "../services/favorite.service.js";
import { successResponse } from "../utils/apiResponse.js";

export async function addFavorite(req, res, next) {
  try {
    const result = await favoriteService.addFavorite(req.user._id, req.params.itemId);
    return successResponse(res, result, 200);
  } catch (err) {
    next(err);
  }
}

export async function removeFavorite(req, res, next) {
  try {
    const result = await favoriteService.removeFavorite(req.user._id, req.params.itemId);
    return successResponse(res, result, 200);
  } catch (err) {
    next(err);
  }
}

export async function getFavorites(req, res, next) {
  try {
    const favorites = await favoriteService.getUserFavorites(req.user._id);
    return successResponse(res, favorites, 200);
  } catch (err) {
    next(err);
  }
}
