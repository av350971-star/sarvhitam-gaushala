import express from "express";
import { getDonation, updateDonation } from "../controllers/donationController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getDonation);
router.put("/", protect, updateDonation);

export default router;
