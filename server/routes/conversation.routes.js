import { Router } from "express";
import * as conversationController from "../controllers/conversation.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  validateConversationId,
  validateSendMessage,
} from "../validators/message.validator.js";

const router = Router();

router.use(requireAuth);

router.get("/", conversationController.getConversations);
router.get(
  "/:id/messages",
  validate(validateConversationId),
  conversationController.getMessages,
);
router.post(
  "/:id/messages",
  validate(validateConversationId),
  validate(validateSendMessage),
  conversationController.sendMessage,
);

export default router;
