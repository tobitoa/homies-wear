import { Favorite, ClothingItem } from "../models/index.js";
import { ApiError } from "../utils/apiError.js";
import { getItemById } from "./item.service.js";

export async function addFavorite(userId, itemId) {
  const item = await ClothingItem.findById(itemId);
  if (!item || item.status === "REMOVED") {
    throw ApiError.notFound("Clothing item not found.");
  }

  await Favorite.findOneAndUpdate(
    { userId, itemId },
    { userId, itemId },
    { upsert: true, returnDocument: "after" },
  );

  return { isFavorite: true, itemId: itemId.toString() };
}

export async function removeFavorite(userId, itemId) {
  await Favorite.findOneAndDelete({ userId, itemId });
  return { isFavorite: false, itemId: itemId.toString() };
}

export async function getUserFavorites(userId) {
  const favorites = await Favorite.find({ userId })
    .sort({ createdAt: -1 })
    .populate({
      path: "itemId",
      populate: {
        path: "ownerId",
        select: "name avatar location rating responseRate successfulSwaps",
      },
    })
    .lean();

  const validItems = favorites
    .filter((f) => f.itemId && f.itemId.status !== "REMOVED")
    .map((f) => {
      const item = f.itemId;
      return {
        id: item._id.toString(),
        title: item.title,
        description: item.description,
        category: item.category,
        brand: item.brand,
        size: item.size,
        condition: item.condition,
        color: item.color,
        images: item.images || [],
        image: item.images?.[0] || "/logomark-transparent.png",
        value: item.estimatedValue,
        estimatedValue: item.estimatedValue,
        location: item.location || "Jorhat, Assam",
        status: item.status,
        owner: item.ownerId?.name || "Homie",
        ownerId: item.ownerId?._id?.toString(),
        isFavorite: true,
        createdAt: item.createdAt,
      };
    });

  return validItems;
}
