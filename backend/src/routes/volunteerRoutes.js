import express from "express";
import { addVolunteer, getVolunteers } from "../controllers/submissionController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", addVolunteer);
router.get("/", protect, getVolunteers);

export default router;
