import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// Load environment variables
dotenv.config();
const app = express();

// ==========================
// Middleware
app.use(express.json());
app.use(cookieParser());

// ==========================
// Import routes
import authRoutes from "./src/routes/authRoutes.js";
import moodRoutes from "./src/routes/moodRoutes.js";
import quoteRoutes from "./src/routes/quoteRoutes.js";
import videoRoutes from "./src/routes/videoRoutes.js";
import uploadFile from "./src/routes/uploadRoute.js";

// ==========================
// Mount routes ke URL path
app.use("/api/auth", authRoutes);
app.use("/api/mood", moodRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/upload", uploadFile);

// ==========================
// Error handling global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// ==========================
// Mode hybrid: lokal & Vercel
const PORT = process.env.PORT || 3000;

// Jika dijalankan di lokal, jalankan listen
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`✅ Server aktif di http://localhost:${PORT}`);
  });
} else {
  console.log("✅ Server siap dijalankan di lingkungan Vercel (serverless)");
}

// Export untuk Vercel
export default app;
