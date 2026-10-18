import express from "express";
import {
  getStatistics,
  addStatistic,
  updateStatistic,
  deleteStatistic,
} from "../controllers/statisticController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getStatistics);
router.post("/", protect, addStatistic);
router.put("/:id", protect, updateStatistic);
router.delete("/:id", protect, deleteStatistic);

export default router;
