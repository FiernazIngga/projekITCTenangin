import express from 'express';
import { kirimPesanController } from '../controllers/homeController.js';
const router = express.Router();

router.get("/", (req, res) => {
    res.send("<h1>API untuk ITC</h1>");
});

router.post("/pesan-publik", kirimPesanController);

export default router;