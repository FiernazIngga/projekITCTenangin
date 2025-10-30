import express from "express";
import { upProfilePicture } from "../controllers/uploadController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/profile/:userId", verifyToken, upProfilePicture);

export default router;
