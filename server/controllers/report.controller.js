import { Report } from "../models/index.js";
import { successResponse } from "../utils/apiResponse.js";

export async function createReport(req, res, next) {
  try {
    const report = await Report.create({
      reporterId: req.user._id,
      reportedUserId: req.body.reportedUserId,
      reportedItemId: req.body.reportedItemId,
      reason: req.body.reason,
      description: req.body.description,
    });
    return successResponse(res, report, 201);
  } catch (err) {
    next(err);
  }
}

export async function getAdminReports(_req, res, next) {
  try {
    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .populate("reporterId reportedUserId reportedItemId")
      .lean();
    return successResponse(res, reports, 200);
  } catch (err) {
    next(err);
  }
}
