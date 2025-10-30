// import multer from "multer";
// import path from "path";
// import fs from "fs";

// const uploadDir = "uploads";
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir);
// }

// // Konfigurasi storage multer
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//         // Ambil ekstensi file
//         const ext = path.extname(file.originalname);

//         // Ambil ID user dari URL
//         const userId = req.params.userId || "unknown";

//         // Tentukan jenis file (misalnya: profile, post, video, dll)
//         const fileType = "Foto Profile";

//         // cari file lama
//         const oldFiles = fs.readdirSync(uploadDir).filter((fileName) =>
//             fileName.startsWith(`${userId}-${fileType}`)
//         );

//         // hapus semua file profil lama milik user
//         oldFiles.forEach((oldFile) => {
//             fs.unlinkSync(path.join(uploadDir, oldFile));
//         });

//         // Bikin tanggal dan jam yang rapi
//         const now = new Date();
//         const timestamp = `${now.getFullYear()}${String(
//             now.getMonth() + 1
//         ).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(
//             now.getHours()
//         ).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(
//             now.getSeconds()
//         ).padStart(2, "0")}`;

//         // Format nama file
//         const fileName = `${userId}_${fileType}_${timestamp}${ext}`;

//         cb(null, fileName);
//     },
// });

// // Filter file berdasarkan tipe MIME
// const fileFilter = (req, file, cb) => {
//     const allowedTypes = ["image/jpeg", "image/png", "video/mp4", "video/mkv"];
//     if (!allowedTypes.includes(file.mimetype)) {
//         return cb(new Error("File type not allowed"), false);
//     }
//     cb(null, true);
// };

// // Export middleware multer
// export const upload = multer({ storage, fileFilter });

// // upload
// // ==========================
// // Deskripsi: Middleware multer untuk upload file user ke folder 'uploads'
// // Behavior:
// //   - Hanya menerima image/jpeg, image/png, video/mp4, video/mkv
// //   - Menghapus file lama user dengan format yang sama sebelum upload baru
// //   - Nama file diformat: <userId>_<fileType>_<YYYYMMDD-HHMMSS>.<ext>
// // Params: userId (URL param)
// // Response jika gagal filter: Error("File type not allowed")
// // Catatan: Folder 'uploads' dibuat otomatis jika belum ada


import multer from "multer";
import path from "path";
import { supabase } from "../databases/supabaseClient.js";

// Simpan file di memory (bukan disk)
const upload = multer({ storage: multer.memoryStorage() });
export const uploadMiddleware = upload.single("file");

// Upload foto profil ke Supabase Storage
export const upProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Tidak ada file yang diupload" });
        }

        const userId = req.params.userId || "unknown";
        const ext = path.extname(req.file.originalname);
        const fileName = `${userId}_fotoprofile_${Date.now()}${ext}`;

        // Cek dan hapus file lama
        const { data: files } = await supabase.storage.from("profile_pictures").list();
        const oldFiles = files.filter(f => f.name.startsWith(`${userId}_fotoprofile_`));
        if (oldFiles.length > 0) {
            await supabase.storage.from("profile_pictures").remove(oldFiles.map(f => f.name));
        }

        // Upload baru ke Supabase
        const { error: uploadError } = await supabase.storage
            .from("profile_pictures")
            .upload(fileName, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: true,
            });

        if (uploadError) throw uploadError;

        // Ambil URL publik
        const { data } = supabase.storage.from("profile_pictures").getPublicUrl(fileName);

        res.json({
            message: "✅ Upload foto profil berhasil!",
            url: data.publicUrl,
        });
    } catch (err) {
        console.error("❌ Error upload foto profil:", err);
        res.status(500).json({ error: err.message });
    }
};
