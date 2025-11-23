import multer from "multer";
import path from "path";
import { supabase } from "../databases/supabaseClient.js";

// Gunakan memoryStorage agar tidak menulis ke filesystem (aman di Vercel)
const upload = multer({ storage: multer.memoryStorage() });

// Middleware upload untuk 1 file dengan field name 'file'
export const uploadMiddleware = (req, res, next) => {
    upload.single("file")(req, res, (err) => {
        if (err && err.code === "LIMIT_UNEXPECTED_FILE") {
            return next(); // abaikan kalau field file tidak ada
        }
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    });
};


// // Upload foto profil ke Supabase Storage dan simpan ke DB
// export const profileAksi = async (req, res) => {
//     try {
//         if (!req.file) {
//             return res
//                 .status(400)
//                 .json({ error: "Tidak ada file yang diupload" });
//         }

//         // Pastikan id_user dikirim di body
//         const id_user = req.user?.id;
//         if (!id_user) {
//             return res
//                 .status(400)
//                 .json({ error: "id_user tidak ditemukan di token" });
//         }

//         const ext = path.extname(req.file.originalname);
//         const fileName = `${id_user}_fotoprofile_${Date.now()}${ext}`;

//         // Hapus file lama (kalau ada)
//         const { data: files, error: listError } = await supabase.storage
//             .from("profile_pictures")
//             .list();
//         if (listError) throw listError;

//         const oldFiles = files.filter((f) =>
//             f.name.startsWith(`${id_user}_fotoprofile_`)
//         );

//         if (oldFiles.length > 0) {
//             const { error: deleteError } = await supabase.storage
//                 .from("profile_pictures")
//                 .remove(oldFiles.map((f) => f.name));
//             if (deleteError) throw deleteError;
//         }

//         // Upload file baru
//         const { error: uploadError } = await supabase.storage
//             .from("profile_pictures")
//             .upload(fileName, req.file.buffer, {
//                 contentType: req.file.mimetype,
//                 upsert: true,
//             });

//         if (uploadError) throw uploadError;

//         // Ambil URL publik
//         const { data: publicData } = supabase.storage
//             .from("profile_pictures")
//             .getPublicUrl(fileName);

//         // 🔹 Update nama file ke tabel "users"
//         const { error: updateError } = await supabase
//             .from("users")
//             .update({ foto_profile: fileName })
//             .eq("id", id_user);

//         if (updateError) throw updateError;

//         // Kirim respons sukses
//         res.status(200).json({
//             message: "✅ Upload foto profil & update database berhasil!",
//             fileName: fileName,
//             url: publicData.publicUrl,
//         });
//     } catch (err) {
//         console.error("❌ Error upload foto profil:", err);
//         res.status(500).json({ error: err.message });
//     }
// };

export const profileAksi = async (req, res) => {
    try {
        const user_id = req.user?.id;
        if (!user_id)
            return res.status(400).json({ message: "User tidak ditemukan" });

        // Tentukan dari mana ambil data
        let body = {};
        let file = null;

        if (req.is("multipart/form-data")) {
            // Kalau form-data, ambil dari req.body + req.file
            body = req.body;
            file = req.file;
        } else if (req.is("application/json")) {
            // Kalau JSON biasa, ambil dari req.body
            body = req.body;
        }

        const {
            username,
            email,
            fullname,
            umur,
            jenis_kelamin,
            lokasi,
            password,
            deskripsi,
        } = body;

        let updateData = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (fullname) updateData.fullname = fullname;
        if (umur) updateData.umur = umur;
        if (jenis_kelamin) updateData.jenis_kelamin = jenis_kelamin;
        if (lokasi) updateData.lokasi = lokasi;
        if (password) updateData.password = password;
        if (deskripsi) updateData.deskripsi = deskripsi;

        // Kalau ada file, upload ke Supabase
        if (file) {
            const ext = path.extname(file.originalname);
            const fileName = `${user_id}_fotoprofile_${Date.now()}${ext}`;

            // Hapus foto lama
            const { data: files } = await supabase.storage
                .from("profile_pictures")
                .list();
            const oldFiles = files.filter((f) =>
                f.name.startsWith(`${user_id}_fotoprofile_`)
            );
            if (oldFiles.length > 0) {
                await supabase.storage
                    .from("profile_pictures")
                    .remove(oldFiles.map((f) => f.name));
            }

            // Upload file baru
            await supabase.storage
                .from("profile_pictures")
                .upload(fileName, file.buffer, {
                    contentType: file.mimetype,
                    upsert: true,
                });
            updateData.foto_profile = fileName;
        }

        // Update database
        const { data: updatedUser } = await supabase
            .from("users")
            .update(updateData)
            .eq("id", user_id)
            .select()
            .single();

        // Ambil URL foto
        let foto_url = updatedUser.foto_profile
            ? supabase.storage
                  .from("profile_pictures")
                  .getPublicUrl(updatedUser.foto_profile).data.publicUrl
            : null;

        // Kembalikan data user
        const userData = {
            id: updatedUser.id,
            foto_profile_url: foto_url ?? "Belum ada foto",
            username: updatedUser.username,
            fullname: updatedUser.fullname,
            email: updatedUser.email,
            umur: updatedUser.umur,
            jenis_kelamin: updatedUser.jenis_kelamin,
            lokasi: updatedUser.lokasi,
            deskripsi: updatedUser.deskripsi,
            joined_date: updatedUser.created_at
                ? updatedUser.created_at.split("T")[0]
                : "Belum ada tanggal",
        };

        res.status(200).json({
            message: "Profil berhasil diperbarui",
            data: userData,
        });
    } catch (err) {
        console.error("❌ Error edit profile:", err);
        res.status(500).json({ error: err.message });
    }
};
