import express from "express";
import {
  getReports,
  addReport,
  updateReportStatus,
  deleteReport,
} from "../controllers/reportController.js";
import { protect } from "../middlewares/auth.js";
import { formLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

// Public can submit problem reports
router.post("/", formLimiter, addReport);

// Admin-only operations
router.get("/", protect, getReports);
router.patch("/:id/status", protect, updateReportStatus);
router.delete("/:id", protect, deleteReport);

export default router;
