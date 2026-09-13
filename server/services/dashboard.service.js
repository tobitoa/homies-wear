import { ClothingItem, SwapRequest, Conversation, User } from "../models/index.js";

export async function getDashboardStats(userId) {
  const [activeListings, pendingRequests, successfulSwaps, conversations, user] =
    await Promise.all([
      ClothingItem.countDocuments({ ownerId: userId, status: "AVAILABLE" }),
      SwapRequest.countDocuments({
        $or: [
          {
            receiverId: userId,
            status: { $in: ["PENDING", "NEGOTIATING", "COUNTERED"] },
          },
          { senderId: userId, status: { $in: ["PENDING", "NEGOTIATING", "COUNTERED"] } },
        ],
      }),
      SwapRequest.countDocuments({
        $or: [{ senderId: userId }, { receiverId: userId }],
        status: "COMPLETED",
      }),
      Conversation.find({ participants: userId }).select("participants").lean(),
      User.findById(userId).lean(),
    ]);

  // Distinct people reached: all participants the user has chatted or swapped with
  const partnerSet = new Set();
  conversations.forEach((conv) => {
    conv.participants.forEach((p) => {
      if (p.toString() !== userId.toString()) {
        partnerSet.add(p.toString());
      }
    });
  });
  const peopleReached = Math.max(partnerSet.size, user?.successfulSwaps || 0);

  return {
    activeListings,
    pendingRequests,
    successfulSwaps,
    peopleReached,
    userRating: user?.rating ? Number(user.rating.toFixed(1)) : 5.0,
    ratingCount: user?.ratingCount || 0,
    responseRate: user?.responseRate || 95,
  };
}

export async function getDashboardOverview(userId) {
  const [stats, myListings, incomingRequests, recentSwaps] = await Promise.all([
    getDashboardStats(userId),
    ClothingItem.find({ ownerId: userId, status: { $ne: "REMOVED" } })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean(),
    SwapRequest.find({
      receiverId: userId,
      status: { $in: ["PENDING", "NEGOTIATING", "COUNTERED"] },
    })
      .sort({ createdAt: -1 })
      .populate("senderId", "name avatar location rating")
      .populate("senderItemId receiverItemId")
      .limit(5)
      .lean(),
    SwapRequest.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
      status: { $in: ["ACCEPTED", "COMPLETED"] },
    })
      .sort({ updatedAt: -1 })
      .populate("senderId receiverId")
      .populate("senderItemId receiverItemId")
      .limit(5)
      .lean(),
  ]);

  return {
    stats,
    myListings: myListings.map((item) => ({
      id: item._id.toString(),
      title: item.title,
      brand: item.brand,
      category: item.category,
      condition: item.condition,
      size: item.size,
      value: item.estimatedValue,
      image: item.images?.[0] || "/logomark-transparent.png",
      status: item.status,
      createdAt: item.createdAt,
    })),
    incomingRequests: incomingRequests.map((req) => ({
      id: req._id.toString(),
      sender: req.senderId,
      senderItem: req.senderItemId,
      receiverItem: req.receiverItemId,
      status: req.status,
      message: req.message,
      createdAt: req.createdAt,
    })),
    recentSwaps,
  };
}
