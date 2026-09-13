import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    reportedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reportedItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClothingItem",
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 1000,
      default: "",
    },
    status: {
      type: String,
      enum: ["open", "investigating", "resolved", "dismissed"],
      default: "open",
      index: true,
    },
    adminNote: String,
    resolvedAt: Date,
  },
  { timestamps: true },
);

export const Report = mongoose.model("Report", reportSchema);
