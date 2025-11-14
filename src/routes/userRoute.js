import express from "express";
import { dataUser, dataUserDashboard, kirimQuote, kirimUserMood } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/user-data", verifyToken, dataUser);
router.post("/data_dashboard", verifyToken, dataUserDashboard);
router.post("/user_mood", verifyToken, kirimUserMood);
router.post("/user_quote", verifyToken, kirimQuote);

export default router;
