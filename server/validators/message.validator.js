import mongoose from "mongoose";

export function validateSendMessage(req) {
  const { text, type, swapData } = req.body;
  if (type === "swap_proposal" && !swapData) {
    return "Swap proposal details are required.";
  }
  if (
    (!text || typeof text !== "string" || text.trim().length === 0) &&
    type !== "swap_proposal"
  ) {
    return "Message content cannot be empty.";
  }
  return null;
}

export function validateConversationId(req) {
  const { id } = req.params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return "Invalid conversation ID.";
  }
  return null;
}
