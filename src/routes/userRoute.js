import express from "express";
import { dataUser, dataUserDashboard, kirimUserMood } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/user-data", verifyToken, dataUser);
router.post("/data_dashboard", verifyToken, dataUserDashboard);
router.post("/user_mood", verifyToken, kirimUserMood);

export default router;
