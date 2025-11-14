import express from "express";
import { profileAksi, uploadMiddleware } from "../controllers/profileController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/upFotoProfile", verifyToken, uploadMiddleware, profileAksi);

export default router;
