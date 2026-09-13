import * as swapService from "../services/swap.service.js";
import { successResponse } from "../utils/apiResponse.js";

export async function createSwap(req, res, next) {
  try {
    const swap = await swapService.createSwapRequest(req.user._id, req.body);
    return successResponse(res, swap, 201);
  } catch (err) {
    next(err);
  }
}

export async function counterSwap(req, res, next) {
  try {
    const swap = await swapService.counterSwapRequest(
      req.user._id,
      req.params.id,
      req.body,
    );
    return successResponse(res, swap, 200);
  } catch (err) {
    next(err);
  }
}

export async function acceptSwap(req, res, next) {
  try {
    const swap = await swapService.acceptSwapRequest(req.user._id, req.params.id);
    return successResponse(res, swap, 200);
  } catch (err) {
    next(err);
  }
}

export async function completeSwap(req, res, next) {
  try {
    const swap = await swapService.completeSwapRequest(req.user._id, req.params.id);
    return successResponse(res, swap, 200);
  } catch (err) {
    next(err);
  }
}

export async function declineOrCancelSwap(req, res, next) {
  try {
    const swap = await swapService.declineOrCancelSwapRequest(
      req.user._id,
      req.params.id,
      req.body.reason,
    );
    return successResponse(res, swap, 200);
  } catch (err) {
    next(err);
  }
}

export async function getMySwaps(req, res, next) {
  try {
    const { type, status } = req.query;
    const swaps = await swapService.getUserSwaps(req.user._id, { type, status });
    return successResponse(res, swaps, 200);
  } catch (err) {
    next(err);
  }
}

export async function getSwapById(req, res, next) {
  try {
    const swap = await swapService.getSwapById(req.params.id, req.user._id);
    return successResponse(res, swap, 200);
  } catch (err) {
    next(err);
  }
}
