import express from "express";
import { upload } from "../middleware/upload.js";
import { upProfilePicture, upVideos } from "../controllers/uploadController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/profile/:userId", verifyToken, upload.single("file"), upProfilePicture);
router.post("/video", upload.single("file"), upVideos);

export default router;
