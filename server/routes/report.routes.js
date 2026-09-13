import { Router } from "express";
import * as reportController from "../controllers/report.controller.js";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", requireAuth, reportController.createReport);
router.get("/admin", requireAuth, requireAdmin, reportController.getAdminReports);

export default router;
