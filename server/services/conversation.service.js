import { Conversation, Message, User } from "../models/index.js";
import { ApiError } from "../utils/apiError.js";
import { createNotification } from "./notification.service.js";

export async function getOrCreateConversation(userAId, userBId, swapRequestId = null) {
  if (userAId.toString() === userBId.toString()) {
    throw ApiError.badRequest("Cannot create a conversation with yourself.");
  }

  let conversation = await Conversation.findOne({
    participants: { $all: [userAId, userBId] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [userAId, userBId],
      swapRequestId,
    });
  } else if (swapRequestId && !conversation.swapRequestId) {
    conversation.swapRequestId = swapRequestId;
    await conversation.save();
  }

  return conversation;
}

export async function getUserConversations(userId) {
  const conversations = await Conversation.find({
    participants: userId,
  })
    .sort({ updatedAt: -1 })
    .populate("participants", "name avatar location rating successfulSwaps")
    .populate("lastMessage")
    .lean();

  const formatted = await Promise.all(
    conversations.map(async (conv) => {
      const otherUser = conv.participants.find(
        (p) => p._id.toString() !== userId.toString(),
      );

      const unreadCount = await Message.countDocuments({
        conversationId: conv._id,
        receiverId: userId,
        read: false,
      });

      return {
        id: conv._id.toString(),
        swapRequestId: conv.swapRequestId?.toString() || null,
        otherUser: otherUser
          ? {
              id: otherUser._id.toString(),
              name: otherUser.name,
              avatar: otherUser.avatar,
              location: otherUser.location,
              rating: otherUser.rating,
            }
          : null,
        lastMessage: conv.lastMessage
          ? {
              id: conv.lastMessage._id.toString(),
              text: conv.lastMessage.text,
              type: conv.lastMessage.type,
              senderId: conv.lastMessage.senderId.toString(),
              createdAt: conv.lastMessage.createdAt,
            }
          : null,
        unreadCount,
        updatedAt: conv.updatedAt,
      };
    }),
  );

  return formatted;
}

export async function getConversationMessages(
  conversationId,
  userId,
  { page = 1, limit = 50 } = {},
) {
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) throw ApiError.notFound("Conversation not found.");

  const isParticipant = conversation.participants.some(
    (p) => p.toString() === userId.toString(),
  );
  if (!isParticipant) {
    throw ApiError.forbidden("You do not have access to this conversation.");
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
  const skip = (pageNum - 1) * limitNum;

  const [messages, total] = await Promise.all([
    Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limitNum)
      .populate("swapData.senderItemId", "title brand estimatedValue images")
      .populate("swapData.receiverItemId", "title brand estimatedValue images")
      .lean(),
    Message.countDocuments({ conversationId }),
  ]);

  // Mark unread messages sent to this user as read
  await Message.updateMany(
    { conversationId, receiverId: userId, read: false },
    { read: true, readAt: new Date() },
  );

  return {
    messages: messages.map((m) => ({
      id: m._id.toString(),
      conversationId: m.conversationId.toString(),
      senderId: m.senderId.toString(),
      receiverId: m.receiverId.toString(),
      text: m.text,
      type: m.type,
      swapRequestId: m.swapRequestId?.toString() || null,
      swapData: m.swapData || null,
      read: m.read,
      createdAt: m.createdAt,
    })),
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum) || 1,
  };
}

export async function sendMessage(
  senderId,
  conversationId,
  { text, type = "text", swapRequestId, swapData },
) {
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) throw ApiError.notFound("Conversation not found.");

  const isParticipant = conversation.participants.some(
    (p) => p.toString() === senderId.toString(),
  );
  if (!isParticipant) {
    throw ApiError.forbidden("You do not have access to this conversation.");
  }

  const receiverId = conversation.participants.find(
    (p) => p.toString() !== senderId.toString(),
  );

  const message = await Message.create({
    conversationId,
    senderId,
    receiverId,
    text: text?.trim() || "",
    type,
    swapRequestId: swapRequestId || conversation.swapRequestId,
    swapData,
  });

  conversation.lastMessage = message._id;
  await conversation.save();

  // Trigger notification if not a system message
  if (type !== "system") {
    const sender = await User.findById(senderId);
    await createNotification({
      userId: receiverId,
      type: "NEW_MESSAGE",
      title: `Message from ${sender?.name || "Homie"}`,
      body:
        text && text.length > 60
          ? `${text.slice(0, 60)}...`
          : text || "Sent a proposal update",
      data: { conversationId, senderId },
    });
  }

  return {
    id: message._id.toString(),
    conversationId: message.conversationId.toString(),
    senderId: message.senderId.toString(),
    receiverId: message.receiverId.toString(),
    text: message.text,
    type: message.type,
    swapRequestId: message.swapRequestId?.toString() || null,
    swapData: message.swapData,
    read: message.read,
    createdAt: message.createdAt,
  };
}

export async function recordSystemMessage({
  senderId,
  receiverId,
  swapRequestId,
  text,
  swapData = null,
}) {
  const conversation = await getOrCreateConversation(senderId, receiverId, swapRequestId);

  const message = await Message.create({
    conversationId: conversation._id,
    senderId,
    receiverId,
    text,
    type: swapData ? "swap_proposal" : "system",
    swapRequestId,
    swapData,
  });

  conversation.lastMessage = message._id;
  await conversation.save();

  return message;
}
