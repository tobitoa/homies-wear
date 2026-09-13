import { Notification } from "../models/index.js";
import { ApiError } from "../utils/apiError.js";

let socketEmitter = null;
export function setSocketEmitter(emitter) {
  socketEmitter = emitter;
}

export async function createNotification({ userId, type, title, body, data = {} }) {
  const notification = await Notification.create({
    userId,
    type,
    title,
    body,
    data,
    read: false,
  });

  const payload = {
    id: notification._id.toString(),
    type: notification.type,
    title: notification.title,
    body: notification.body,
    data: notification.data,
    read: notification.read,
    createdAt: notification.createdAt,
  };

  // Real-time broadcast to connected client if socket emitter is attached
  if (socketEmitter) {
    socketEmitter(userId.toString(), "new_notification", payload);
  }

  return payload;
}

export async function getUserNotifications(userId, { limit = 30 } = {}) {
  const notifications = await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .limit(Math.min(50, limit))
    .lean();

  const unreadCount = await Notification.countDocuments({ userId, read: false });

  return {
    notifications: notifications.map((n) => ({
      id: n._id.toString(),
      type: n.type,
      title: n.title,
      body: n.body,
      data: n.data,
      read: n.read,
      createdAt: n.createdAt,
    })),
    unreadCount,
  };
}
export async function markNotificationAsRead(notificationId, userId) {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { read: true },
    { returnDocument: "after" },
  );

  if (!notification) {
    throw ApiError.notFound("Notification not found.");
  }

  return {
    id: notification._id.toString(),
    read: notification.read,
  };
}

export async function markAllNotificationsAsRead(userId) {
  await Notification.updateMany({ userId, read: false }, { read: true });
  return { message: "All notifications marked as read." };
}
