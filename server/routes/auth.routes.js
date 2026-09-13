import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { authLimiter } from "../middleware/rateLimiter.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { validateRegister, validateLogin } from "../validators/auth.validator.js";

const router = Router();

router.post(
  "/register",
  authLimiter,
  validate(validateRegister),
  authController.register,
);
router.post("/login", authLimiter, validate(validateLogin), authController.login);
router.get("/me", requireAuth, authController.getMe);
router.post("/logout", requireAuth, authController.logout);

export default router;
