import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";
import { seedInitialData } from "./utils/seedData.js";
import { errorHandler } from "./middlewares/errorHandler.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import siteInfoRoutes from "./routes/siteInfoRoutes.js";
import statisticRoutes from "./routes/statisticRoutes.js";
import cowRoutes from "./routes/cowRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import volunteerRoutes from "./routes/volunteerRoutes.js";
import suggestionRoutes from "./routes/suggestionRoutes.js";
import adoptionRoutes from "./routes/adoptionRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(morgan("dev"));

// Flexible CORS for Production & Localhost
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        !process.env.CLIENT_URL ||
        process.env.CLIENT_URL === "*" ||
        process.env.NODE_ENV !== "production"
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Static uploads directory
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Gaushala Backend API is running smoothly",
    timestamp: new Date().toISOString(),
  });
});

// Mount API Routes
app.use("/api/auth", authRoutes);
app.use("/api/site-info", siteInfoRoutes);
app.use("/api/statistics", statisticRoutes);
app.use("/api/cows", cowRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/donation", donationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/suggestions", suggestionRoutes);
app.use("/api/adoptions", adoptionRoutes);
app.use("/api/upload", uploadRoutes);

// Optional: Serve frontend production build if present
const frontendDist = path.join(__dirname, "../../frontend/dist");
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
      return next();
    }
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

// Auto-connect database for serverless requests (Vercel)
app.use(async (req, res, next) => {
  if (req.path.startsWith("/api")) {
    await connectDB();
  }
  next();
});

// Error Handler
app.use(errorHandler);

// Start Server & Connect Database
const startServer = async () => {
  const isConnected = await connectDB();
  if (isConnected) {
    await seedInitialData();
  }

  app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(` Gaushala Backend Server running on port: ${PORT}`);
    console.log(` Local API: http://localhost:${PORT}/api/health`);
    console.log(` MongoDB Status: ${isConnected ? "Connected" : "Not Connected (Check .env)"}`);
    console.log(`==================================================\n`);
  });
};

if (!process.env.VERCEL) {
  startServer();
}

export default app;
