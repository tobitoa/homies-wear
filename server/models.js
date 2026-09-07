import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    avatar: String,
    location: String,
    latitude: Number,
    longitude: Number,
    bio: { type: String, maxlength: 500 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    rating: { type: Number, default: 0 },
    responseRate: { type: Number, default: 0 },
    successfulSwaps: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const itemSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, maxlength: 1200 },
    category: { type: String, required: true, index: true },
    brand: { type: String, trim: true },
    size: String,
    condition: String,
    color: String,
    images: [{ type: String }],
    estimatedValue: { type: Number, min: 0 },
    location: String,
    latitude: Number,
    longitude: Number,
    status: {
      type: String,
      enum: ["available", "requested", "swapped", "hidden"],
      default: "available",
      index: true,
    },
  },
  { timestamps: true },
);
itemSchema.index({
  title: "text",
  brand: "text",
  category: "text",
  description: "text",
});

const swapSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    senderItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClothingItem",
      required: true,
    },
    receiverItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClothingItem",
      required: true,
    },
    message: { type: String, maxlength: 1000 },
    senderValue: Number,
    receiverValue: Number,
    status: {
      type: String,
      enum: ["pending", "negotiating", "accepted", "completed", "declined", "cancelled"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true },
);

const reportSchema = new mongoose.Schema(
  {
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reportedUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reportedItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClothingItem",
    },
    reason: { type: String, required: true },
    description: { type: String, maxlength: 1000 },
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

export const User = mongoose.model("User", userSchema);
export const ClothingItem = mongoose.model("ClothingItem", itemSchema);
export const SwapRequest = mongoose.model("SwapRequest", swapSchema);
export const Report = mongoose.model("Report", reportSchema);
