import dotenv from 'dotenv';
dotenv.config();

import { ambilMoodTerbaru, getUserData, getUserMoods } from "../models/userModels.js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const STORAGE_PATH = "/storage/v1/object/public/profile_pictures/";

// Data user + hanya mood terbaru
export const dataUser = async (req, res, next) => {
    try {
        const user_id = req.user.id;
        if (!user_id) return res.status(400).json({ message: "user_id tidak ditemukan" });

        const data = await getUserData(user_id);
        const latestMood = await ambilMoodTerbaru(user_id);

        const userData = {
            id: data.id ?? "Belum ada ID",
            foto_profile_url: data.foto_profile
                ? `${SUPABASE_URL}${STORAGE_PATH}${data.foto_profile}`
                : "Belum ada foto",
            username: data.username ?? "Belum ada username",
            email: data.email ?? "Belum ada email",
            umur: data.umur ?? "Belum diatur",
            jenis_kelamin: data.jenis_kelamin ?? "Belum diatur",
            lokasi: data.lokasi ?? "Belum diatur",
            joined_date: data.created_at ? data.created_at.split("T")[0] : "Belum ada tanggal",
            latest_mood: latestMood || "Belum memilih mood"
        };

        res.status(200).json(userData);
    } catch (err) {
        console.error("Gagal mengambil data user:", err.message);
        next(err);
    }
};

// Data user + semua mood untuk dashboard
export const dataUserDashboard = async (req, res, next) => {
    try {
        const user_id = req.user.id;
        if (!user_id) return res.status(400).json({ message: "user_id tidak ditemukan" });

        const data = await getUserData(user_id);
        const allMoods = await getUserMoods(user_id);

        const userData = {
            id: data.id ?? "Belum ada ID",
            foto_profile_url: data.foto_profile
                ? `${SUPABASE_URL}${STORAGE_PATH}${data.foto_profile}`
                : "Belum ada foto",
            username: data.username ?? "Belum ada username",
            email: data.email ?? "Belum ada email",
            umur: data.umur ?? "Belum diatur",
            jenis_kelamin: data.jenis_kelamin ?? "Belum diatur",
            lokasi: data.lokasi ?? "Belum diatur",
            joined_date: data.created_at ? data.created_at.split("T")[0] : "Belum ada tanggal",
            moods: allMoods || []
        };

        res.status(200).json(userData);
    } catch (err) {
        console.error("Gagal mengambil data user dashboard:", err.message);
        next(err);
    }
};
