import mongoose from "mongoose";
import { SwapRequest, ClothingItem, User } from "../models/index.js";
import { ApiError } from "../utils/apiError.js";
import { createNotification } from "./notification.service.js";
import { recordSystemMessage } from "./conversation.service.js";

export async function createSwapRequest(
  senderId,
  { receiverId, senderItemId, receiverItemId, message },
) {
  if (senderId.toString() === receiverId.toString()) {
    throw ApiError.badRequest("You cannot swap clothing items with yourself.");
  }

  const [senderItem, receiverItem] = await Promise.all([
    ClothingItem.findById(senderItemId),
    ClothingItem.findById(receiverItemId),
  ]);

  if (!senderItem) throw ApiError.notFound("Your clothing item was not found.");
  if (!receiverItem)
    throw ApiError.notFound("The requested clothing item was not found.");

  if (senderItem.ownerId.toString() !== senderId.toString()) {
    throw ApiError.forbidden("You can only offer items that you own.");
  }
  if (receiverItem.ownerId.toString() !== receiverId.toString()) {
    throw ApiError.badRequest(
      "The requested item does not belong to the specified user.",
    );
  }

  if (senderItem.status !== "AVAILABLE") {
    throw ApiError.conflict(
      `Your item "${senderItem.title}" is currently ${senderItem.status.toLowerCase()} and cannot be offered in a swap.`,
    );
  }
  if (receiverItem.status !== "AVAILABLE") {
    throw ApiError.conflict(
      `"${receiverItem.title}" is no longer available for swaps (status: ${receiverItem.status.toLowerCase()}).`,
    );
  }

  // Check for existing active swap request for these items
  const existingActive = await SwapRequest.findOne({
    senderItemId,
    receiverItemId,
    status: { $in: ["PENDING", "NEGOTIATING", "COUNTERED", "ACCEPTED"] },
  });
  if (existingActive) {
    throw ApiError.conflict("An active swap request already exists for these items.");
  }

  const swap = await SwapRequest.create({
    senderId,
    receiverId,
    senderItemId,
    receiverItemId,
    senderValue: senderItem.estimatedValue,
    receiverValue: receiverItem.estimatedValue,
    message: message?.trim() || "",
    status: "PENDING",
    history: [
      {
        proposedBy: senderId,
        senderItemId,
        receiverItemId,
        senderValue: senderItem.estimatedValue,
        receiverValue: receiverItem.estimatedValue,
        message: message?.trim() || "Initial swap proposal",
        createdAt: new Date(),
      },
    ],
  });

  // Mark items as NEGOTIATING
  await Promise.all([
    ClothingItem.findByIdAndUpdate(senderItemId, { status: "NEGOTIATING" }),
    ClothingItem.findByIdAndUpdate(receiverItemId, { status: "NEGOTIATING" }),
  ]);

  const populated = await getSwapById(swap._id, senderId);

  // Send Notification to receiver
  const sender = await User.findById(senderId);
  await createNotification({
    userId: receiverId,
    type: "SWAP_REQUEST",
    title: "New Swap Request",
    body: `${sender?.name || "A homie"} wants to swap "${senderItem.title}" for your "${receiverItem.title}".`,
    data: { swapId: swap._id, senderId, itemId: receiverItemId },
  });

  // Record conversation & system message
  await recordSystemMessage({
    senderId,
    receiverId,
    swapRequestId: swap._id,
    text: `Swap proposal sent: ${senderItem.title} (₹${senderItem.estimatedValue}) ⇄ ${receiverItem.title} (₹${receiverItem.estimatedValue})`,
    swapData: {
      senderItemId: senderItem._id,
      receiverItemId: receiverItem._id,
      senderValue: senderItem.estimatedValue,
      receiverValue: receiverItem.estimatedValue,
      status: "PENDING",
    },
  });

  return populated;
}

export async function counterSwapRequest(
  userId,
  swapId,
  { senderItemId, receiverItemId, senderValue, receiverValue, message },
) {
  const swap = await SwapRequest.findById(swapId);
  if (!swap) throw ApiError.notFound("Swap request not found.");

  const isSender = swap.senderId.toString() === userId.toString();
  const isReceiver = swap.receiverId.toString() === userId.toString();
  if (!isSender && !isReceiver) {
    throw ApiError.forbidden("You are not a participant in this swap request.");
  }

  if (["ACCEPTED", "COMPLETED", "DECLINED", "CANCELLED"].includes(swap.status)) {
    throw ApiError.badRequest(
      `Cannot counter a swap that is already ${swap.status.toLowerCase()}.`,
    );
  }

  // Update proposed items or values if provided
  const finalSenderItem = senderItemId
    ? await ClothingItem.findById(senderItemId)
    : await ClothingItem.findById(swap.senderItemId);
  const finalReceiverItem = receiverItemId
    ? await ClothingItem.findById(receiverItemId)
    : await ClothingItem.findById(swap.receiverItemId);

  if (!finalSenderItem || !finalReceiverItem) {
    throw ApiError.notFound("One or more items in the proposal could not be found.");
  }

  // Save current proposal to history
  swap.history.push({
    proposedBy: userId,
    senderItemId: finalSenderItem._id,
    receiverItemId: finalReceiverItem._id,
    senderValue: senderValue ?? finalSenderItem.estimatedValue,
    receiverValue: receiverValue ?? finalReceiverItem.estimatedValue,
    message: message?.trim() || "Counter offer",
    createdAt: new Date(),
  });

  swap.senderItemId = finalSenderItem._id;
  swap.receiverItemId = finalReceiverItem._id;
  swap.senderValue = senderValue ?? finalSenderItem.estimatedValue;
  swap.receiverValue = receiverValue ?? finalReceiverItem.estimatedValue;
  swap.message = message?.trim() || swap.message;
  swap.status = "COUNTERED";

  await swap.save();

  const recipientId = isSender ? swap.receiverId : swap.senderId;
  const proposer = await User.findById(userId);

  await createNotification({
    userId: recipientId,
    type: "SWAP_COUNTER",
    title: "Counter Offer Received",
    body: `${proposer?.name || "A homie"} sent a counter offer on your swap proposal.`,
    data: { swapId: swap._id, senderId: userId },
  });

  await recordSystemMessage({
    senderId: userId,
    receiverId: recipientId,
    swapRequestId: swap._id,
    text: `Counter offer proposed: ${finalSenderItem.title} (₹${swap.senderValue}) ⇄ ${finalReceiverItem.title} (₹${swap.receiverValue})`,
    swapData: {
      senderItemId: finalSenderItem._id,
      receiverItemId: finalReceiverItem._id,
      senderValue: swap.senderValue,
      receiverValue: swap.receiverValue,
      status: "COUNTERED",
    },
  });

  return getSwapById(swap._id, userId);
}

export async function acceptSwapRequest(userId, swapId) {
  const swap = await SwapRequest.findById(swapId);
  if (!swap) throw ApiError.notFound("Swap request not found.");

  const isSender = swap.senderId.toString() === userId.toString();
  const isReceiver = swap.receiverId.toString() === userId.toString();
  if (!isSender && !isReceiver) {
    throw ApiError.forbidden("You are not a participant in this swap request.");
  }

  if (["ACCEPTED", "COMPLETED", "DECLINED", "CANCELLED"].includes(swap.status)) {
    throw ApiError.badRequest(`Swap is already ${swap.status.toLowerCase()}.`);
  }

  // Atomic reservation of both items
  const reservedSenderItem = await ClothingItem.findOneAndUpdate(
    { _id: swap.senderItemId, status: { $in: ["AVAILABLE", "NEGOTIATING"] } },
    { status: "RESERVED" },
    { returnDocument: "after" },
  );
  if (!reservedSenderItem) {
    throw ApiError.conflict("Sender item is no longer available to be reserved.");
  }

  const reservedReceiverItem = await ClothingItem.findOneAndUpdate(
    { _id: swap.receiverItemId, status: { $in: ["AVAILABLE", "NEGOTIATING"] } },
    { status: "RESERVED" },
    { returnDocument: "after" },
  );
  if (!reservedReceiverItem) {
    // Rollback sender item reservation
    await ClothingItem.findByIdAndUpdate(swap.senderItemId, { status: "AVAILABLE" });
    throw ApiError.conflict("Receiver item is no longer available to be reserved.");
  }

  swap.status = "ACCEPTED";
  await swap.save();

  // Decline other pending requests for these now reserved items
  await SwapRequest.updateMany(
    {
      _id: { $ne: swap._id },
      status: { $in: ["PENDING", "NEGOTIATING"] },
      $or: [
        { senderItemId: swap.senderItemId },
        { receiverItemId: swap.senderItemId },
        { senderItemId: swap.receiverItemId },
        { receiverItemId: swap.receiverItemId },
      ],
    },
    { status: "DECLINED" },
  );

  const otherParticipantId = isSender ? swap.receiverId : swap.senderId;
  const user = await User.findById(userId);

  await createNotification({
    userId: otherParticipantId,
    type: "SWAP_ACCEPTED",
    title: "Swap Accepted! 🎉",
    body: `${user?.name || "Your swap partner"} accepted the swap proposal. Items are now reserved!`,
    data: { swapId: swap._id, senderId: userId },
  });

  await recordSystemMessage({
    senderId: userId,
    receiverId: otherParticipantId,
    swapRequestId: swap._id,
    text: `Swap proposal accepted! Both pieces are now reserved. Coordinate the exchange in this chat.`,
    swapData: {
      senderItemId: swap.senderItemId,
      receiverItemId: swap.receiverItemId,
      status: "ACCEPTED",
    },
  });

  return getSwapById(swap._id, userId);
}

export async function completeSwapRequest(userId, swapId) {
  const swap = await SwapRequest.findById(swapId);
  if (!swap) throw ApiError.notFound("Swap request not found.");

  const isSender = swap.senderId.toString() === userId.toString();
  const isReceiver = swap.receiverId.toString() === userId.toString();
  if (!isSender && !isReceiver) {
    throw ApiError.forbidden("You are not a participant in this swap request.");
  }

  if (swap.status !== "ACCEPTED") {
    throw ApiError.badRequest("Swap must be accepted before it can be completed.");
  }

  // Add confirmation if not already present
  if (!swap.confirmedBy.some((id) => id.toString() === userId.toString())) {
    swap.confirmedBy.push(userId);
  }

  const otherUserId = isSender ? swap.receiverId : swap.senderId;
  const bothConfirmed = swap.confirmedBy.length >= 2;

  if (bothConfirmed) {
    swap.status = "COMPLETED";

    // Mark items as SWAPPED
    await Promise.all([
      ClothingItem.findByIdAndUpdate(swap.senderItemId, { status: "SWAPPED" }),
      ClothingItem.findByIdAndUpdate(swap.receiverItemId, { status: "SWAPPED" }),
    ]);

    // Increment successfulSwaps counter for both users
    await Promise.all([
      User.findByIdAndUpdate(swap.senderId, { $inc: { successfulSwaps: 1 } }),
      User.findByIdAndUpdate(swap.receiverId, { $inc: { successfulSwaps: 1 } }),
    ]);

    // Send notifications to both participants to rate each other
    await Promise.all([
      createNotification({
        userId: swap.senderId,
        type: "SWAP_COMPLETED",
        title: "Swap Completed! 🌟",
        body: "Your swap has completed. Please leave a rating for your swap partner!",
        data: { swapId: swap._id, senderId: swap.receiverId },
      }),
      createNotification({
        userId: swap.receiverId,
        type: "SWAP_COMPLETED",
        title: "Swap Completed! 🌟",
        body: "Your swap has completed. Please leave a rating for your swap partner!",
        data: { swapId: swap._id, senderId: swap.senderId },
      }),
    ]);

    await recordSystemMessage({
      senderId: userId,
      receiverId: otherUserId,
      swapRequestId: swap._id,
      text: "Swap completed! Both users confirmed the exchange. Wear them well! Don't forget to rate each other.",
      swapData: {
        senderItemId: swap.senderItemId,
        receiverItemId: swap.receiverItemId,
        status: "COMPLETED",
      },
    });
  } else {
    // Only one has confirmed so far
    await createNotification({
      userId: otherUserId,
      type: "SWAP_COMPLETED",
      title: "Swap Completion Awaiting Confirmation",
      body: "Your swap partner has confirmed the physical swap. Please confirm to complete it.",
      data: { swapId: swap._id, senderId: userId },
    });

    await recordSystemMessage({
      senderId: userId,
      receiverId: otherUserId,
      swapRequestId: swap._id,
      text: `Exchange confirmed by ${isSender ? "sender" : "receiver"}. Waiting for counterpart confirmation.`,
    });
  }

  await swap.save();
  return getSwapById(swap._id, userId);
}

export async function declineOrCancelSwapRequest(userId, swapId, reason = "Cancelled") {
  const swap = await SwapRequest.findById(swapId);
  if (!swap) throw ApiError.notFound("Swap request not found.");

  const isSender = swap.senderId.toString() === userId.toString();
  const isReceiver = swap.receiverId.toString() === userId.toString();
  if (!isSender && !isReceiver) {
    throw ApiError.forbidden("You are not a participant in this swap request.");
  }

  if (swap.status === "COMPLETED") {
    throw ApiError.badRequest("Completed swaps cannot be cancelled.");
  }

  const newStatus = isSender ? "CANCELLED" : "DECLINED";
  swap.status = newStatus;
  await swap.save();

  // Revert items back to AVAILABLE if they were NEGOTIATING or RESERVED for this swap
  await Promise.all([
    ClothingItem.findOneAndUpdate(
      { _id: swap.senderItemId, status: { $in: ["NEGOTIATING", "RESERVED"] } },
      { status: "AVAILABLE" },
    ),
    ClothingItem.findOneAndUpdate(
      { _id: swap.receiverItemId, status: { $in: ["NEGOTIATING", "RESERVED"] } },
      { status: "AVAILABLE" },
    ),
  ]);

  const otherUserId = isSender ? swap.receiverId : swap.senderId;
  const user = await User.findById(userId);

  await createNotification({
    userId: otherUserId,
    type: "SWAP_DECLINED",
    title: `Swap ${newStatus === "CANCELLED" ? "Cancelled" : "Declined"}`,
    body: `${user?.name || "Your partner"} ${newStatus.toLowerCase()} the swap request.`,
    data: { swapId: swap._id, senderId: userId },
  });

  await recordSystemMessage({
    senderId: userId,
    receiverId: otherUserId,
    swapRequestId: swap._id,
    text: `Swap request ${newStatus.toLowerCase()}: ${reason}`,
  });

  return getSwapById(swap._id, userId);
}

export async function getUserSwaps(userId, { type = "all", status } = {}) {
  const query = {};

  if (type === "incoming") {
    query.receiverId = userId;
  } else if (type === "sent") {
    query.senderId = userId;
  } else {
    query.$or = [{ senderId: userId }, { receiverId: userId }];
  }

  if (status && status !== "ALL") {
    query.status = status;
  }

  const swaps = await SwapRequest.find(query)
    .sort({ updatedAt: -1 })
    .populate("senderId", "name avatar location rating successfulSwaps")
    .populate("receiverId", "name avatar location rating successfulSwaps")
    .populate("senderItemId")
    .populate("receiverItemId")
    .lean();

  return swaps.map((s) => transformSwap(s, userId));
}

export async function getSwapById(swapId, currentUserId) {
  const swap = await SwapRequest.findById(swapId)
    .populate("senderId", "name avatar location rating successfulSwaps")
    .populate("receiverId", "name avatar location rating successfulSwaps")
    .populate("senderItemId")
    .populate("receiverItemId")
    .lean();

  if (!swap) throw ApiError.notFound("Swap request not found.");

  return transformSwap(swap, currentUserId);
}

function transformSwap(swap, currentUserId) {
  const isSender = currentUserId
    ? swap.senderId?._id?.toString() === currentUserId.toString()
    : false;
  return {
    id: swap._id.toString(),
    status: swap.status,
    message: swap.message,
    senderValue: swap.senderValue,
    receiverValue: swap.receiverValue,
    difference: Math.abs((swap.senderValue || 0) - (swap.receiverValue || 0)),
    isSender,
    sender: swap.senderId,
    receiver: swap.receiverId,
    senderItem: swap.senderItemId
      ? {
          id: swap.senderItemId._id?.toString(),
          title: swap.senderItemId.title,
          brand: swap.senderItemId.brand,
          size: swap.senderItemId.size,
          condition: swap.senderItemId.condition,
          value: swap.senderItemId.estimatedValue,
          image: swap.senderItemId.images?.[0] || "/logomark-transparent.png",
          status: swap.senderItemId.status,
        }
      : null,
    receiverItem: swap.receiverItemId
      ? {
          id: swap.receiverItemId._id?.toString(),
          title: swap.receiverItemId.title,
          brand: swap.receiverItemId.brand,
          size: swap.receiverItemId.size,
          condition: swap.receiverItemId.condition,
          value: swap.receiverItemId.estimatedValue,
          image: swap.receiverItemId.images?.[0] || "/logomark-transparent.png",
          status: swap.receiverItemId.status,
        }
      : null,
    history: swap.history || [],
    confirmedBy: (swap.confirmedBy || []).map((id) => id.toString()),
    createdAt: swap.createdAt,
    updatedAt: swap.updatedAt,
  };
}
