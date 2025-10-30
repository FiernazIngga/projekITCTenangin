import express from "express";
import { uploadMiddleware, upProfilePicture } from "../controllers/uploadController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/upFotoProfile", verifyToken, uploadMiddleware, upProfilePicture);

export default router;
