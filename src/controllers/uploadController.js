import multer from "multer";
import path from "path";
import { supabase } from "../databases/supabaseClient.js";

// Gunakan memoryStorage agar tidak menyimpan file ke disk
const upload = multer({ storage: multer.memoryStorage() });
export const uploadMiddleware = upload.single("file");

// === Upload Foto Profil ===
export const upProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Tidak ada file yang diupload" });
        }

        const userId = req.params.userId || "unknown";
        const ext = path.extname(req.file.originalname);
        const fileName = `${userId}_fotoprofile_${Date.now()}${ext}`;
        const fileBuffer = req.file.buffer; // 📦 langsung ambil dari buffer

        // 🟡 1️⃣ Cek foto profil lama user
        const { data: files, error: listError } = await supabase.storage
            .from("profile_pictures")
            .list();

        if (listError) throw listError;

        const oldFiles = files.filter((f) => f.name.startsWith(`${userId}_fotoprofile_`));

        if (oldFiles.length > 0) {
            const { error: deleteError } = await supabase.storage
                .from("profile_pictures")
                .remove(oldFiles.map((f) => f.name));
            if (deleteError) throw deleteError;
            console.log("🧹 File lama dihapus:", oldFiles.map((f) => f.name));
        }

        // 🟢 2️⃣ Upload foto baru ke Supabase
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from("profile_pictures")
            .upload(fileName, fileBuffer, {
                contentType: req.file.mimetype,
                upsert: true,
            });

        if (uploadError) throw uploadError;

        // 🟢 3️⃣ Ambil URL publik
        const publicUrl = supabase.storage
            .from("profile_pictures")
            .getPublicUrl(fileName).data.publicUrl;

        res.json({
            message: "✅ Upload foto profil berhasil!",
            url: publicUrl,
        });
    } catch (err) {
        console.error("❌ Error upload foto profil:", err);
        res.status(500).json({ error: err.message });
    }
};

// === Upload Video ===
export const upVideos = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Tidak ada file yang diupload" });
        }

        const userId = req.params.userId || "unknown";
        const ext = path.extname(req.file.originalname);
        const fileName = `${userId}_video_${Date.now()}${ext}`;
        const fileBuffer = req.file.buffer; // 📦 langsung ambil dari buffer

        // 🟡 1️⃣ Hapus video lama (opsional)
        const { data: files, error: listError } = await supabase.storage
            .from("videos")
            .list();

        if (listError) throw listError;

        const oldFiles = files.filter((f) => f.name.startsWith(`${userId}_video_`));

        if (oldFiles.length > 0) {
            const { error: deleteError } = await supabase.storage
                .from("videos")
                .remove(oldFiles.map((f) => f.name));
            if (deleteError) throw deleteError;
            console.log("🧹 Video lama dihapus:", oldFiles.map((f) => f.name));
        }

        // 🟢 2️⃣ Upload video baru
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from("videos")
            .upload(fileName, fileBuffer, {
                contentType: req.file.mimetype,
                upsert: true,
            });

        if (uploadError) throw uploadError;

        // 🟢 3️⃣ Ambil URL publik
        const publicUrl = supabase.storage
            .from("videos")
            .getPublicUrl(fileName).data.publicUrl;

        res.json({
            message: "✅ Upload video berhasil!",
            url: publicUrl,
        });
    } catch (err) {
        console.error("❌ Error upload video:", err);
        res.status(500).json({ error: err.message });
    }
};
