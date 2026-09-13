import mongoose from "mongoose";

export function validateCreateRating(req) {
  const { swapId, score } = req.body;
  if (!swapId || !mongoose.Types.ObjectId.isValid(swapId)) {
    return "Valid swap ID is required.";
  }
  const numScore = Number(score);
  if (isNaN(numScore) || numScore < 1 || numScore > 5 || !Number.isInteger(numScore)) {
    return "Rating score must be an integer between 1 and 5.";
  }
  return null;
}
