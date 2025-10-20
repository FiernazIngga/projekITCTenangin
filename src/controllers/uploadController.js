import fs from "fs";
import path from "path";
import { supabase } from "../databases/supabaseClient.js";

// === Upload Foto Profil ===
export const upProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res
                .status(400)
                .json({ error: "Tidak ada file yang diupload" });
        }

        const userId = req.params.userId || "unknown";
        const ext = path.extname(req.file.originalname);
        const fileName = `${userId}_fotoprofile_${Date.now()}${ext}`;
        const filePath = req.file.path;
        const fileBuffer = fs.readFileSync(filePath);

        // 🟡 1️⃣ Cek foto profil lama user
        const { data: files, error: listError } = await supabase.storage
            .from("profile_pictures")
            .list();

        if (listError) throw listError;

        const oldFiles = files.filter((f) =>
            f.name.startsWith(`${userId}_fotoprofile_`)
        );

        if (oldFiles.length > 0) {
            const { error: deleteError } = await supabase.storage
                .from("profile_pictures")
                .remove(oldFiles.map((f) => f.name));

            if (deleteError) throw deleteError;

            console.log(
                "🧹 File lama dihapus:",
                oldFiles.map((f) => f.name)
            );
        }

        // 🟢 2️⃣ Upload foto baru
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from("profile_pictures")
            .upload(fileName, fileBuffer, {
                contentType: req.file.mimetype,
            });

        if (uploadError) throw uploadError;

        // 🟢 3️⃣ Ambil URL publik
        const publicUrl = supabase.storage
            .from("profile_pictures")
            .getPublicUrl(fileName).publicUrl;

        // Hapus file lokal
        try {
            fs.unlinkSync(filePath);
        } catch (unlinkErr) {
            console.warn("⚠️ Gagal hapus file lokal:", unlinkErr);
        }

        res.json({
            message: "✅ Upload foto profil berhasil!",
            url: publicUrl,
        });
    } catch (err) {
        console.error("❌ Error upload foto profil:", err);
        res.status(500).json({ error: err.message });
    }
};

// upProfilePicture
// ==========================
// Deskripsi: Upload foto profil user ke bucket Supabase 'profile_pictures'
// Params: userId (URL param)
// Request: file di multipart/form-data
// Response 200: { message: "✅ Upload foto profil berhasil!", url }
// Response 400: { error: "Tidak ada file yang diupload" }
// Response 500: { error: "Error dari server / Supabase" }
// Catatan: File lama user akan otomatis dihapus sebelum upload baru

// Jika berhasil upload / Foto Profile
// {
//   "message": "✅ Upload foto profil berhasil!",
//   "url": "https://xyz.supabase.co/storage/v1/object/public/profile_pictures/nama_file.jpg"
// }

// Jika file udah ada
// {
//   "message": "⚠️ File dengan nama ini sudah ada di bucket. Upload dibatalkan."
// }

// Jika tidak file di request
// {
//   "error": "Tidak ada file yang diupload"
// }

// Jika error internal (misal gagal baca file / gagal upload ke Supabase)
// {
//   "error": "Error message dari server (misal: The resource already exists)"
// }

// === Upload Video ===
export const upVideos = async (req, res) => {
    try {
        if (!req.file) {
            return res
                .status(400)
                .json({ error: "Tidak ada file yang diupload" });
        }

        const userId = req.params.userId || "unknown";
        const ext = path.extname(req.file.originalname);
        const fileName = `${userId}_video_${Date.now()}${ext}`;
        const filePath = req.file.path;
        const fileBuffer = fs.readFileSync(filePath);

        // 🟡 1️⃣ Cek apakah ada video lama user ini (opsional)
        const { data: files, error: listError } = await supabase.storage
            .from("videos")
            .list();

        if (listError) throw listError;

        const oldFiles = files.filter((f) =>
            f.name.startsWith(`${userId}_video_`)
        );

        if (oldFiles.length > 0) {
            const { error: deleteError } = await supabase.storage
                .from("videos")
                .remove(oldFiles.map((f) => f.name));

            if (deleteError) throw deleteError;
            console.log(
                "🧹 Video lama dihapus:",
                oldFiles.map((f) => f.name)
            );
        }

        // 🟢 2️⃣ Upload video baru
        const { data, error } = await supabase.storage
            .from("videos")
            .upload(fileName, fileBuffer, {
                contentType: req.file.mimetype,
            });

        if (error) throw error;

        // 🟢 3️⃣ Ambil URL publik
        const { data: publicData } = supabase.storage
            .from("videos")
            .getPublicUrl(fileName);

        fs.unlinkSync(filePath);

        res.json({
            message: "✅ Upload video berhasil!",
            url: publicData.publicUrl,
        });
    } catch (err) {
        console.error("❌ Error upload video:", err);
        res.status(500).json({ error: err.message });
    }
};

// upVideos
// ==========================
// Deskripsi: Upload video user ke bucket Supabase 'videos'
// Params: userId (URL param)
// Request: file di multipart/form-data
// Response 200: { message: "✅ Upload video berhasil!", url }
// Response 400: { error: "Tidak ada file yang diupload" }
// Response 500: { error: "Error dari server / Supabase" }
// Catatan: File lama user akan otomatis dihapus sebelum upload baru

// Jika berhasil upload / Videos
// {
//   "message": "✅ Upload video berhasil!",
//   "url": "https://xyz.supabase.co/storage/v1/object/public/videos/nama_file.mp4"
// }

// Jika file udah ada
// {
//   "message": "⚠️ File dengan nama ini sudah ada di bucket. Upload dibatalkan."
// }

// Jika tidak file di request
// {
//   "error": "Tidak ada file yang diupload"
// }

// Jika error internal (misal gagal baca file / gagal upload ke Supabase)
// {
//   "error": "Error message dari server (misal: The resource already exists)"
// }
