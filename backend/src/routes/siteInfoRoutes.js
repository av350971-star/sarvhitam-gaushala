import express from "express";
import { getSiteInfo, updateSiteInfo } from "../controllers/siteInfoController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getSiteInfo);
router.put("/", protect, updateSiteInfo);

export default router;
