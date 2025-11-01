import { getUserData } from "../models/userModels.js";

export const dataUser = async (req, res, next) => {
    try {
        const user_id = req.user.id;
        if (!user_id) {
            return res.status(400).json({ message: "user_id tidak ditemukan" });
        }

        const data = await getUserData(user_id);
        const SUPABASE_URL = "https://hmrznbfwznbwehcmffmx.supabase.co";
        const STORAGE_PATH = "/storage/v1/object/public/profile_pictures/";

        const userData = {
            id: data.id,
            foto_profile_url: data.foto_profile
                ? `${SUPABASE_URL}${STORAGE_PATH}${data.foto_profile}`
                : null,
            username: data.username,
            email: data.email,
            password: data.password,
            umur: data.umur ?? "Belum diatur",
            jenis_kelamin: data.jenis_kelamin ?? "Belum diatur",
            lokasi: data.lokasi ?? "Belum diatur",
            joined_date: data.created_at
                ? data.created_at.split("T")[0] // ambil tanggal saja, format YYYY-MM-DD
                : null,
        };

        res.status(200).json(userData);
    } catch (err) {
        console.error("Gagal mengambil data user:", err.message);
        next(err);
    }
};
