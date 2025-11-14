import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// Load environment variables
dotenv.config();
const app = express();

app.use(cors({
    origin: [
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://localhost:5173",
        "https://projek-itc-tenangin.vercel.app"
    ],
    credentials: true, 
}));

// ==========================
// Middleware
app.use(express.json());
app.use(cookieParser());

// ==========================
// Import routes
import tampilAwal from "./src/routes/homeRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import users from "./src/routes/userRoute.js";
import uploadFile from "./src/routes/uploadRoute.js";

app.use("/", tampilAwal);

// ==========================
// Mount routes ke URL path
app.use("/api/auth", authRoutes);
app.use("/api/data", users);
app.use("/api/upload", uploadFile);

// ==========================
// Error handling global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});


// Export untuk Vercel
export default app;
