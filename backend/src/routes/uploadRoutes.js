import express from "express";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "कृपया एक इमेज फ़ाइल चुनें",
    });
  }

  // Handle both memory storage (serverless/Vercel) and disk storage (local/VPS)
  let fileUrl;
  if (req.file.buffer) {
    fileUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
  } else {
    fileUrl = `/uploads/${req.file.filename}`;
  }

  res.status(201).json({
    success: true,
    url: fileUrl,
    filename: req.file.filename || req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
  });
});

export default router;
