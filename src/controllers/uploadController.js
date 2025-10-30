import multer from "multer";
import path from "path";
import { supabase } from "../databases/supabaseClient.js";

// Gunakan memoryStorage agar tidak menulis ke filesystem (aman di Vercel)
const upload = multer({ storage: multer.memoryStorage() });

// Middleware upload untuk 1 file dengan field name 'file'
export const uploadMiddleware = upload.single("file");

// Upload foto profil ke Supabase Storage dan simpan ke DB
export const upProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res
                .status(400)
                .json({ error: "Tidak ada file yang diupload" });
        }

        // Pastikan id_user dikirim di body
        const { id_user } = req.user.id_user;
        if (!id_user) {
            return res
                .status(400)
                .json({ error: "id_user tidak ditemukan di token" });
        }

        const ext = path.extname(req.file.originalname);
        const fileName = `${id_user}_fotoprofile_${Date.now()}${ext}`;

        // Hapus file lama (kalau ada)
        const { data: files, error: listError } = await supabase.storage
            .from("profile_pictures")
            .list();
        if (listError) throw listError;

        const oldFiles = files.filter((f) =>
            f.name.startsWith(`${id_user}_fotoprofile_`)
        );

        if (oldFiles.length > 0) {
            const { error: deleteError } = await supabase.storage
                .from("profile_pictures")
                .remove(oldFiles.map((f) => f.name));
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

        // 🔹 Update nama file ke tabel "users"
        const { error: updateError } = await supabase
            .from("users")
            .update({ foto_profile: fileName })
            .eq("id", id_user);

        if (updateError) throw updateError;

        // Kirim respons sukses
        res.status(200).json({
            message: "✅ Upload foto profil & update database berhasil!",
            fileName: fileName,
            url: publicData.publicUrl,
        });
    } catch (err) {
        console.error("❌ Error upload foto profil:", err);
        res.status(500).json({ error: err.message });
    }
};
