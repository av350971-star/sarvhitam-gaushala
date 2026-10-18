import express from "express";
import {
  addAdoptionRequest,
  getAdoptionRequests,
} from "../controllers/submissionController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", addAdoptionRequest);
router.get("/", protect, getAdoptionRequests);

export default router;
