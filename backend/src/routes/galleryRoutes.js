import express from "express";
import {
  getGalleryPhotos,
  addGalleryPhoto,
  updateGalleryPhoto,
  deleteGalleryPhoto,
} from "../controllers/galleryController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getGalleryPhotos);
router.post("/", protect, addGalleryPhoto);
router.put("/:id", protect, updateGalleryPhoto);
router.delete("/:id", protect, deleteGalleryPhoto);

export default router;
