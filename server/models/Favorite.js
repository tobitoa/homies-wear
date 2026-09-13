import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClothingItem",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

// Unique compound index to prevent duplicate favorites
favoriteSchema.index({ userId: 1, itemId: 1 }, { unique: true });

export const Favorite = mongoose.model("Favorite", favoriteSchema);
