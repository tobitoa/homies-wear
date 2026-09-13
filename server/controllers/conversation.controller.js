import * as conversationService from "../services/conversation.service.js";
import { successResponse } from "../utils/apiResponse.js";

export async function getConversations(req, res, next) {
  try {
    const conversations = await conversationService.getUserConversations(req.user._id);
    return successResponse(res, conversations, 200);
  } catch (err) {
    next(err);
  }
}

export async function getMessages(req, res, next) {
  try {
    const { page, limit } = req.query;
    const result = await conversationService.getConversationMessages(
      req.params.id,
      req.user._id,
      { page, limit },
    );
    return successResponse(res, result.messages, 200, {
      total: result.total,
      page: result.page,
      pages: result.pages,
    });
  } catch (err) {
    next(err);
  }
}

export async function sendMessage(req, res, next) {
  try {
    const message = await conversationService.sendMessage(
      req.user._id,
      req.params.id,
      req.body,
    );
    return successResponse(res, message, 201);
  } catch (err) {
    next(err);
  }
}
