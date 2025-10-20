import express from "express";
import { getUserMood, insertMoodUser } from "../controllers/moodController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/inMood", verifyToken, insertMoodUser);
router.get("/:user_id", getUserMood);

export default router;
