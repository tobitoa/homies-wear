import { User, ClothingItem, SwapRequest } from "../models/index.js";
import { ApiError } from "../utils/apiError.js";

export async function getUserProfile(userId) {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("User not found.");

  const [activeListings, successfulSwaps] = await Promise.all([
    ClothingItem.countDocuments({ ownerId: userId, status: "AVAILABLE" }),
    SwapRequest.countDocuments({
      $or: [{ senderId: userId }, { receiverId: userId }],
      status: "COMPLETED",
    }),
  ]);

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    location: user.location,
    bio: user.bio,
    role: user.role,
    rating: Number(user.rating.toFixed(1)),
    ratingCount: user.ratingCount,
    responseRate: user.responseRate,
    successfulSwaps: Math.max(successfulSwaps, user.successfulSwaps),
    activeListings,
    createdAt: user.createdAt,
  };
}

export async function updateUserProfile(
  userId,
  { name, bio, location, avatar, coordinates },
) {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("User not found.");

  if (name && name.trim().length >= 2) user.name = name.trim();
  if (bio !== undefined) user.bio = bio.trim();
  if (location !== undefined) user.location = location.trim();
  if (avatar !== undefined) user.avatar = avatar.trim();
  if (Array.isArray(coordinates) && coordinates.length === 2) {
    user.locationGeo = { type: "Point", coordinates };
  }

  await user.save();
  return getUserProfile(userId);
}
