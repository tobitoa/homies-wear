import { Router } from "express";
import * as swapController from "../controllers/swap.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { swapLimiter } from "../middleware/rateLimiter.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  validateCreateSwap,
  validateCounterSwap,
  validateSwapId,
} from "../validators/swap.validator.js";

const router = Router();

router.use(requireAuth);

router.post("/", swapLimiter, validate(validateCreateSwap), swapController.createSwap);
router.get("/", swapController.getMySwaps);
router.get("/:id", validate(validateSwapId), swapController.getSwapById);
router.post(
  "/:id/counter",
  swapLimiter,
  validate(validateSwapId),
  validate(validateCounterSwap),
  swapController.counterSwap,
);
router.put(
  "/:id/accept",
  swapLimiter,
  validate(validateSwapId),
  swapController.acceptSwap,
);
router.post(
  "/:id/complete",
  swapLimiter,
  validate(validateSwapId),
  swapController.completeSwap,
);
router.put(
  "/:id/decline",
  swapLimiter,
  validate(validateSwapId),
  swapController.declineOrCancelSwap,
);

export default router;
