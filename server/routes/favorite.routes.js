import { Router } from "express";
import * as favoriteController from "../controllers/favorite.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAuth);

router.get("/", favoriteController.getFavorites);
router.post("/:itemId", favoriteController.addFavorite);
router.delete("/:itemId", favoriteController.removeFavorite);

export default router;
