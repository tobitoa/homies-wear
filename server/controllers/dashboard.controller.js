import * as dashboardService from "../services/dashboard.service.js";
import { successResponse } from "../utils/apiResponse.js";

export async function getStats(req, res, next) {
  try {
    const stats = await dashboardService.getDashboardStats(req.user._id);
    return successResponse(res, stats, 200);
  } catch (err) {
    next(err);
  }
}

export async function getOverview(req, res, next) {
  try {
    const overview = await dashboardService.getDashboardOverview(req.user._id);
    return successResponse(res, overview, 200);
  } catch (err) {
    next(err);
  }
}
