import * as notificationService from "../services/notification.service.js";
import { successResponse } from "../utils/apiResponse.js";

export async function getNotifications(req, res, next) {
  try {
    const result = await notificationService.getUserNotifications(req.user._id);
    return successResponse(res, result.notifications, 200, {
      unreadCount: result.unreadCount,
    });
  } catch (err) {
    next(err);
  }
}

export async function markAsRead(req, res, next) {
  try {
    const result = await notificationService.markNotificationAsRead(
      req.params.id,
      req.user._id,
    );
    return successResponse(res, result, 200);
  } catch (err) {
    next(err);
  }
}

export async function markAllAsRead(req, res, next) {
  try {
    const result = await notificationService.markAllNotificationsAsRead(req.user._id);
    return successResponse(res, result, 200);
  } catch (err) {
    next(err);
  }
}
