import { Rating, SwapRequest, User } from "../models/index.js";
import { ApiError } from "../utils/apiError.js";
import { createNotification } from "./notification.service.js";

export async function createSwapRating(raterId, { swapId, score, review }) {
  const swap = await SwapRequest.findById(swapId);
  if (!swap) throw ApiError.notFound("Swap request not found.");

  if (swap.status !== "COMPLETED") {
    throw ApiError.badRequest(
      "You can only rate participants after the swap has been completed.",
    );
  }

  const isSender = swap.senderId.toString() === raterId.toString();
  const isReceiver = swap.receiverId.toString() === raterId.toString();

  if (!isSender && !isReceiver) {
    throw ApiError.forbidden("You were not a participant in this swap.");
  }

  const ratedUserId = isSender ? swap.receiverId : swap.senderId;
  if (raterId.toString() === ratedUserId.toString()) {
    throw ApiError.badRequest("You cannot rate yourself.");
  }

  const existingRating = await Rating.findOne({ swapId, raterId });
  if (existingRating) {
    throw ApiError.conflict("You have already submitted a rating for this swap.");
  }

  const numScore = Number(score);
  const rating = await Rating.create({
    swapId,
    raterId,
    ratedUserId,
    score: numScore,
    review: review?.trim() || "",
  });

  // Automatically recalculate user's average rating & rating count
  const allRatings = await Rating.find({ ratedUserId }).select("score").lean();
  const totalScore = allRatings.reduce((sum, r) => sum + r.score, 0);
  const ratingCount = allRatings.length;
  const newAverage = ratingCount > 0 ? totalScore / ratingCount : 5.0;

  await User.findByIdAndUpdate(ratedUserId, {
    rating: Math.round(newAverage * 10) / 10,
    ratingCount,
  });

  const rater = await User.findById(raterId);
  await createNotification({
    userId: ratedUserId,
    type: "NEW_RATING",
    title: "New Rating Received ⭐",
    body: `${rater?.name || "Your swap partner"} gave you ${numScore} stars: "${review?.trim() || "Great swap!"}"`,
    data: { swapId, senderId: raterId },
  });

  return {
    id: rating._id.toString(),
    swapId: rating.swapId.toString(),
    score: rating.score,
    review: rating.review,
    createdAt: rating.createdAt,
  };
}

export async function getUserRatings(userId) {
  const ratings = await Rating.find({ ratedUserId: userId })
    .sort({ createdAt: -1 })
    .populate("raterId", "name avatar location")
    .lean();

  return ratings.map((r) => ({
    id: r._id.toString(),
    score: r.score,
    review: r.review,
    rater: r.raterId,
    createdAt: r.createdAt,
  }));
}
