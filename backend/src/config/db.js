import mongoose from "mongoose";

let cachedConn = null;

export const connectDB = async () => {
  // Reuse existing connection if already connected (vital for Vercel Serverless)
  if (cachedConn && mongoose.connection.readyState === 1) {
    return true;
  }

  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/gaushala_db";

  try {
    cachedConn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false,
    });
    console.log(` MongoDB Connected Successfully: ${cachedConn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    cachedConn = null;
    return false;
  }
};
