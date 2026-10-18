import express from "express";
import { addSuggestion, getSuggestions } from "../controllers/submissionController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", addSuggestion);
router.get("/", protect, getSuggestions);

export default router;
