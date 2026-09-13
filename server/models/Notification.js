import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        "SWAP_REQUEST",
        "SWAP_COUNTER",
        "SWAP_ACCEPTED",
        "SWAP_COMPLETED",
        "SWAP_DECLINED",
        "NEW_MESSAGE",
        "NEW_RATING",
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    data: {
      swapId: { type: mongoose.Schema.Types.ObjectId, ref: "SwapRequest" },
      conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: "ClothingItem" },
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true },
);

notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

export const Notification = mongoose.model("Notification", notificationSchema);
