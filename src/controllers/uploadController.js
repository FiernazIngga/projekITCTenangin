// import multer from "multer";
// import path from "path";
// import { supabase } from "../databases/supabaseClient.js";

// // ✅ Gunakan memory storage (sudah cocok untuk serverless)
// const upload = multer({ storage: multer.memoryStorage() });
// export const uploadMiddleware = upload.single("file");

// // === Upload Foto Profil ===
// export const upProfilePicture = async (req, res) => {
//     try {
//         if (!req.file) {
//             return res
//                 .status(400)
//                 .json({ error: "Tidak ada file yang diupload" });
//         }

//         const userId = req.params.userId || "unknown";
//         const ext = path.extname(req.file.originalname);
//         const fileName = `${userId}_fotoprofile_${Date.now()}${ext}`;
//         const fileBuffer = req.file.buffer;

//         // 🟡 Hapus foto lama (kalau ada)
//         const { data: files, error: listError } = await supabase.storage
//             .from("profile_pictures")
//             .list("", { limit: 100 });

//         if (listError) throw listError;

//         const oldFiles = (files || []).filter((f) =>
//             f.name.startsWith(`${userId}_fotoprofile_`)
//         );

//         if (oldFiles.length > 0) {
//             const { error: deleteError } = await supabase.storage
//                 .from("profile_pictures")
//                 .remove(oldFiles.map((f) => f.name));
//             if (deleteError) throw deleteError;
//             console.log(
//                 "File lama dihapus:",
//                 oldFiles.map((f) => f.name)
//             );
//         }

//         // 🟢 Upload foto baru
//         const { error: uploadError } = await supabase.storage
//             .from("profile_pictures")
//             .upload(fileName, fileBuffer, {
//                 contentType: req.file.mimetype,
//                 upsert: true,
//             });

//         if (uploadError) throw uploadError;

//         // 🟢 Dapatkan URL publik
//         const { data: urlData } = supabase.storage
//             .from("profile_pictures")
//             .getPublicUrl(fileName);

//         return res.status(200).json({
//             message: "Upload foto profil berhasil!",
//             url: urlData.publicUrl,
//         });
//     } catch (err) {
//         console.error("❌ Error upload foto profil:", err.message);
//         return res.status(500).json({ error: err.message });
//     }
// };

// // === Upload Video ===
// export const upVideos = async (req, res) => {
//     try {
//         if (!req.file) {
//             return res
//                 .status(400)
//                 .json({ error: "Tidak ada file yang diupload" });
//         }

//         const userId = req.params.userId || "unknown";
//         const ext = path.extname(req.file.originalname);
//         const fileName = `${userId}_video_${Date.now()}${ext}`;
//         const fileBuffer = req.file.buffer;

//         // 🟡 Hapus video lama (optional)
//         const { data: files, error: listError } = await supabase.storage
//             .from("videos")
//             .list("", { limit: 100 });

//         if (listError) throw listError;

//         const oldFiles = (files || []).filter((f) =>
//             f.name.startsWith(`${userId}_video_`)
//         );

//         if (oldFiles.length > 0) {
//             const { error: deleteError } = await supabase.storage
//                 .from("videos")
//                 .remove(oldFiles.map((f) => f.name));
//             if (deleteError) throw deleteError;
//             console.log(
//                 "🧹 Video lama dihapus:",
//                 oldFiles.map((f) => f.name)
//             );
//         }

//         // 🟢 Upload video baru
//         const { error: uploadError } = await supabase.storage
//             .from("videos")
//             .upload(fileName, fileBuffer, {
//                 contentType: req.file.mimetype,
//                 upsert: true,
//             });

//         if (uploadError) throw uploadError;

//         // 🟢 Ambil URL publik
//         const { data: urlData } = supabase.storage
//             .from("videos")
//             .getPublicUrl(fileName);

//         return res.status(200).json({
//             message: "Upload video berhasil!",
//             url: urlData.publicUrl,
//         });
//     } catch (err) {
//         console.error("Error upload video:", err.message);
//         return res.status(500).json({ error: err.message });
//     }
// };

import multer from "multer";
import path from "path";
import { supabase } from "../databases/supabaseClient.js";

// Gunakan memoryStorage agar tidak menulis ke filesystem (aman di Vercel)
const upload = multer({ storage: multer.memoryStorage() });

// Middleware upload untuk 1 file dengan field name 'file'
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

        // Hapus file lama (kalau ada)
        const { data: files, error: listError } = await supabase.storage
            .from("profile_pictures")
            .list();
        if (listError) throw listError;

        const oldFiles = files.filter(f => f.name.startsWith(`${userId}_fotoprofile_`));
        if (oldFiles.length > 0) {
            const { error: deleteError } = await supabase.storage
                .from("profile_pictures")
                .remove(oldFiles.map(f => f.name));
            if (deleteError) throw deleteError;
        }

        // Upload file baru
        const { error: uploadError } = await supabase.storage
            .from("profile_pictures")
            .upload(fileName, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: true,
            });

        if (uploadError) throw uploadError;

        // Ambil URL publik
        const { data: publicData } = supabase.storage
            .from("profile_pictures")
            .getPublicUrl(fileName);

        res.status(200).json({
            message: "✅ Upload foto profil berhasil!",
            url: publicData.publicUrl,
        });
    } catch (err) {
        console.error("❌ Error upload foto profil:", err);
        res.status(500).json({ error: err.message });
    }
};
