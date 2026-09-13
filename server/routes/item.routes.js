import { Router } from "express";
import * as itemController from "../controllers/item.controller.js";
import { requireAuth, optionalAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  validateCreateItem,
  validateUpdateItem,
  validateNearbyQuery,
} from "../validators/item.validator.js";

const router = Router();

router.get("/", optionalAuth, itemController.getItems);
router.get(
  "/nearby",
  optionalAuth,
  validate(validateNearbyQuery),
  itemController.getNearby,
);
router.post("/calculate-value", itemController.calculateValue);
router.get("/:id", optionalAuth, itemController.getItemById);
router.post("/", requireAuth, validate(validateCreateItem), itemController.createItem);
router.put("/:id", requireAuth, validate(validateUpdateItem), itemController.updateItem);
router.delete("/:id", requireAuth, itemController.deleteItem);

export default router;
