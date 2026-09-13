import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
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
    text: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
    type: {
      type: String,
      enum: ["text", "swap_proposal", "system"],
      default: "text",
    },
    swapRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SwapRequest",
    },
    swapData: {
      senderItemId: { type: mongoose.Schema.Types.ObjectId, ref: "ClothingItem" },
      receiverItemId: { type: mongoose.Schema.Types.ObjectId, ref: "ClothingItem" },
      senderValue: Number,
      receiverValue: Number,
      status: String,
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

messageSchema.index({ conversationId: 1, createdAt: 1 });
messageSchema.index({ receiverId: 1, read: 1 });

export const Message = mongoose.model("Message", messageSchema);
