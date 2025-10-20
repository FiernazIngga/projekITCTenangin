import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

// Middleware untuk parse JSON request body
app.use(express.json());

// Middleware untuk parse cookie
app.use(cookieParser());

// ==========================
// Import routes
import authRoutes from "./src/routes/authRoutes.js";      // Route untuk autentikasi (login, register, logout, refresh token)
import moodRoutes from "./src/routes/moodRoutes.js";      // Route untuk mood user
import quoteRoutes from "./src/routes/quoteRoutes.js";    // Route untuk quotes
import videoRoutes from "./src/routes/videoRoutes.js";    // Route untuk video
import uploadFile from "./src/routes/uploadRoute.js";     // Route untuk upload file (foto, video)

// ==========================
// Mount routes ke URL path
app.use("/api/auth", authRoutes);    // Semua route auth akan berada di /api/auth/*
app.use("/api/mood", moodRoutes);    // Semua route mood berada di /api/mood/*
app.use("/api/quotes", quoteRoutes);// Semua route quotes berada di /api/quotes/*
app.use("/api/videos", videoRoutes);// Semua route video berada di /api/videos/*
app.use("/api/upload", uploadFile);  // Semua route upload berada di /api/upload/*

// ==========================
// Error handling global
app.use((err, req, res, next) => {
  console.error(err.stack); // Log error ke console
  res.status(500).json({ message: "Internal Server Error" }); // Kirim respon error ke client
});

// ==========================
// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server aktif di http://localhost:${PORT}`);
});

// server.js
// ==========================
// Deskripsi: Entry point utama server Express
// Middleware:
//   - express.json() → parsing JSON request body
//   - cookieParser() → parsing cookie
// Routes:
//   - /api/auth → autentikasi user
//   - /api/mood → mood API
//   - /api/quotes → quotes API
//   - /api/videos → video API
//   - /api/upload → upload foto/video
// Error handling:
//   - Menangkap semua error yang tidak tertangani dan mengembalikan status 500
// Start server:
//   - Menggunakan port dari process.env.PORT
