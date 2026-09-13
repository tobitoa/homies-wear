import * as itemService from "../services/item.service.js";
import { calculateEstimatedSwapValue } from "../services/swapValue.service.js";
import { successResponse } from "../utils/apiResponse.js";

export async function getItems(req, res, next) {
  try {
    const {
      q,
      category,
      brand,
      condition,
      size,
      minPrice,
      maxPrice,
      sort,
      page,
      limit,
      ownerId,
      status,
      userLat,
      userLng,
    } = req.query;

    const currentUserId = req.user?._id;

    const result = await itemService.getItems({
      q,
      category,
      brand,
      condition,
      size,
      minPrice,
      maxPrice,
      sort,
      page,
      limit,
      ownerId,
      status,
      userLat,
      userLng,
      currentUserId,
    });

    return successResponse(res, result.items, 200, result.pagination);
  } catch (err) {
    next(err);
  }
}

export async function getNearby(req, res, next) {
  try {
    const { lat, lng, radius, limit } = req.query;
    const currentUserId = req.user?._id;

    const items = await itemService.getNearbyItems({
      lat,
      lng,
      radiusKm: radius,
      limit,
      currentUserId,
    });

    return successResponse(res, items, 200);
  } catch (err) {
    next(err);
  }
}

export async function getItemById(req, res, next) {
  try {
    const currentUserId = req.user?._id;
    const item = await itemService.getItemById(req.params.id, currentUserId);
    return successResponse(res, item, 200);
  } catch (err) {
    next(err);
  }
}

export async function createItem(req, res, next) {
  try {
    const item = await itemService.createItem(req.user._id, req.body);
    return successResponse(res, item, 201);
  } catch (err) {
    next(err);
  }
}

export async function updateItem(req, res, next) {
  try {
    const item = await itemService.updateItem(req.params.id, req.user._id, req.body);
    return successResponse(res, item, 200);
  } catch (err) {
    next(err);
  }
}

export async function deleteItem(req, res, next) {
  try {
    const result = await itemService.deleteItem(req.params.id, req.user._id);
    return successResponse(res, result, 200);
  } catch (err) {
    next(err);
  }
}

export async function calculateValue(req, res, next) {
  try {
    const { category, brand, condition, ageMonths, originalPrice } = req.body;
    const result = calculateEstimatedSwapValue({
      category,
      brand,
      condition,
      ageMonths,
      originalPrice,
    });
    return successResponse(res, result, 200);
  } catch (err) {
    next(err);
  }
}
