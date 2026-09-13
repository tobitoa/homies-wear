import { Router } from "express";
import * as ratingController from "../controllers/rating.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { validateCreateRating } from "../validators/rating.validator.js";

const router = Router();

router.post(
  "/",
  requireAuth,
  validate(validateCreateRating),
  ratingController.createRating,
);
router.get("/user/:userId", ratingController.getUserRatings);

export default router;
