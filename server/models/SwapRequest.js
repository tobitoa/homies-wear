import mongoose from "mongoose";

export const SWAP_STATUSES = [
  "PENDING",
  "NEGOTIATING",
  "COUNTERED",
  "ACCEPTED",
  "COMPLETED",
  "DECLINED",
  "CANCELLED",
  "EXPIRED",
];

const proposalHistorySchema = new mongoose.Schema(
  {
    proposedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
    senderValue: Number,
    receiverValue: Number,
    message: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

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
    message: {
      type: String,
      maxlength: 1000,
      default: "",
    },
    senderValue: {
      type: Number,
      default: 0,
    },
    receiverValue: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: SWAP_STATUSES,
      default: "PENDING",
      index: true,
    },
    history: [proposalHistorySchema],
    confirmedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

swapSchema.index({ senderId: 1, status: 1 });
swapSchema.index({ receiverId: 1, status: 1 });
swapSchema.index({ status: 1, createdAt: -1 });
swapSchema.index({ senderItemId: 1, receiverItemId: 1 });

export const SwapRequest = mongoose.model("SwapRequest", swapSchema);
