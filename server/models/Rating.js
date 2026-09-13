import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    swapId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SwapRequest",
      required: true,
      index: true,
    },
    raterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    ratedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    score: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      maxlength: 600,
      trim: true,
      default: "",
    },
  },
  { timestamps: true },
);

// One rating per participant per swap
ratingSchema.index({ swapId: 1, raterId: 1 }, { unique: true });

export const Rating = mongoose.model("Rating", ratingSchema);
