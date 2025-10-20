import express from "express";
import { upload } from "../middleware/upload.js";
import { upProfilePicture, upVideos } from "../controllers/uploadController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================
// Route upload foto profil
// URL: /profile/:userId
// Method: POST
// Middleware:
//   - verifyToken → pastikan user sudah login dan token valid
//   - upload.single("file") → multer untuk upload satu file, field name: "file"
// Deskripsi: Upload foto profil user, mengganti file lama jika ada
// Params: userId (URL param)
// Request body: file (form-data)
// Response sukses: 
//   {
//      message: "✅ Upload foto profil berhasil!",
//      url: "<public URL file di Supabase>"
//   }
// Response jika tidak ada file: { error: "Tidak ada file yang diupload" }
// Response jika error internal: { error: "Error message dari server" }
router.post("/profile/:userId", verifyToken, upload.single("file"), upProfilePicture);

// ==========================
// Route upload video
// URL: /video
// Method: POST
// Middleware:
//   - upload.single("file") → multer untuk upload satu file, field name: "file"
// Deskripsi: Upload video user, mengganti file lama jika ada
// Request body: file (form-data)
// Response sukses:
//   {
//      message: "✅ Upload video berhasil!",
//      url: "<public URL video di Supabase>"
//   }
// Response jika tidak ada file: { error: "Tidak ada file yang diupload" }
// Response jika error internal: { error: "Error message dari server" }
router.post("/video", upload.single("file"), upVideos);

export default router;

// uploadRoute.js
// ==========================
// Deskripsi: Router untuk upload file (foto profil dan video)
// Routes utama:
//   - POST /profile/:userId → upload foto profil user (dengan verifyToken)
//   - POST /video → upload video user
