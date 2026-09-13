import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { requireAuth, optionalAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/:id", optionalAuth, userController.getProfile);
router.put("/profile", requireAuth, userController.updateProfile);

export default router;
