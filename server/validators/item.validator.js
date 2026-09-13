import mongoose from "mongoose";

export function validateCreateItem(req) {
  const { title, category, estimatedValue, condition } = req.body;
  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return "Item title is required.";
  }
  if (!category || typeof category !== "string" || category.trim().length === 0) {
    return "Category is required.";
  }
  if (
    estimatedValue == null ||
    isNaN(Number(estimatedValue)) ||
    Number(estimatedValue) < 0
  ) {
    return "A valid estimated value is required.";
  }
  if (condition) {
    const validConditions = ["Brand new", "Like new", "Excellent", "Good", "Fair"];
    if (!validConditions.includes(condition)) {
      return `Condition must be one of: ${validConditions.join(", ")}`;
    }
  }
  return null;
}

export function validateUpdateItem(req) {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return "Invalid item ID.";
  }
  if (req.body.estimatedValue != null) {
    if (isNaN(Number(req.body.estimatedValue)) || Number(req.body.estimatedValue) < 0) {
      return "Estimated value must be a positive number.";
    }
  }
  return null;
}

export function validateNearbyQuery(req) {
  const { lat, lng, radius } = req.query;
  if (lat != null && (isNaN(Number(lat)) || Number(lat) < -90 || Number(lat) > 90)) {
    return "Latitude must be between -90 and 90.";
  }
  if (lng != null && (isNaN(Number(lng)) || Number(lng) < -180 || Number(lng) > 180)) {
    return "Longitude must be between -180 and 180.";
  }
  if (radius != null && (isNaN(Number(radius)) || Number(radius) <= 0)) {
    return "Radius must be a positive number in kilometers.";
  }
  return null;
}
