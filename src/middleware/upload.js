import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Konfigurasi storage multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Ambil ekstensi file
        const ext = path.extname(file.originalname);

        // Ambil ID user dari URL
        const userId = req.params.userId || "unknown";

        // Tentukan jenis file (misalnya: profile, post, video, dll)
        const fileType = "Foto Profile";

        // cari file lama
        const oldFiles = fs.readdirSync(uploadDir).filter((fileName) =>
            fileName.startsWith(`${userId}-${fileType}`)
        );

        // hapus semua file profil lama milik user
        oldFiles.forEach((oldFile) => {
            fs.unlinkSync(path.join(uploadDir, oldFile));
        });

        // Bikin tanggal dan jam yang rapi
        const now = new Date();
        const timestamp = `${now.getFullYear()}${String(
            now.getMonth() + 1
        ).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(
            now.getHours()
        ).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(
            now.getSeconds()
        ).padStart(2, "0")}`;

        // Format nama file
        const fileName = `${userId}_${fileType}_${timestamp}${ext}`;

        cb(null, fileName);
    },
});

// Filter file berdasarkan tipe MIME
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "video/mp4", "video/mkv"];
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error("File type not allowed"), false);
    }
    cb(null, true);
};

// Export middleware multer
export const upload = multer({ storage, fileFilter });

// upload
// ==========================
// Deskripsi: Middleware multer untuk upload file user ke folder 'uploads'
// Behavior:
//   - Hanya menerima image/jpeg, image/png, video/mp4, video/mkv
//   - Menghapus file lama user dengan format yang sama sebelum upload baru
//   - Nama file diformat: <userId>_<fileType>_<YYYYMMDD-HHMMSS>.<ext>
// Params: userId (URL param)
// Response jika gagal filter: Error("File type not allowed")
// Catatan: Folder 'uploads' dibuat otomatis jika belum ada
