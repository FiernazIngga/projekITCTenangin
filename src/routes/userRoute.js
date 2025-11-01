import express from "express";
import { dataUser, dataUserDashboard } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/user-data", verifyToken, dataUser);
router.post("/data_dashboard", verifyToken, dataUserDashboard);

export default router;
