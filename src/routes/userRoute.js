import express from "express";
import { dataUser } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/user", verifyToken, dataUser);

export default router;
