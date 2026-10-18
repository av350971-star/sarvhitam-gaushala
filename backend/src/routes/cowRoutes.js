import express from "express";
import {
  getCows,
  getCowById,
  addCow,
  updateCow,
  deleteCow,
} from "../controllers/cowController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getCows);
router.get("/:id", getCowById);
router.post("/", protect, addCow);
router.put("/:id", protect, updateCow);
router.delete("/:id", protect, deleteCow);

export default router;
