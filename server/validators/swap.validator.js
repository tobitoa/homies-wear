import mongoose from "mongoose";

export function validateCreateSwap(req) {
  const { receiverId, senderItemId, receiverItemId } = req.body;
  if (!receiverId || !mongoose.Types.ObjectId.isValid(receiverId)) {
    return "Valid receiver ID is required.";
  }
  if (!senderItemId || !mongoose.Types.ObjectId.isValid(senderItemId)) {
    return "Valid sender item ID is required.";
  }
  if (!receiverItemId || !mongoose.Types.ObjectId.isValid(receiverItemId)) {
    return "Valid receiver item ID is required.";
  }
  return null;
}

export function validateCounterSwap(req) {
  const { senderItemId, receiverItemId } = req.body;
  if (senderItemId && !mongoose.Types.ObjectId.isValid(senderItemId)) {
    return "Invalid sender item ID.";
  }
  if (receiverItemId && !mongoose.Types.ObjectId.isValid(receiverItemId)) {
    return "Invalid receiver item ID.";
  }
  return null;
}

export function validateSwapId(req) {
  const { id } = req.params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return "Invalid swap ID.";
  }
  return null;
}
