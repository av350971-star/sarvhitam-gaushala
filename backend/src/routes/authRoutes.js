import express from "express";
import {
  loginAdmin,
  getAdminProfile,
  changeAdminPassword,
} from "../controllers/authController.js";
import { protect } from "../middlewares/auth.js";
import { loginLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/login", loginLimiter, loginAdmin);
router.get("/me", protect, getAdminProfile);
router.put("/change-password", protect, changeAdminPassword);

export default router;
