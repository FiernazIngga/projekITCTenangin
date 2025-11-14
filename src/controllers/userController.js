import dotenv from "dotenv";
dotenv.config();

import {
    ambilMoodTerbaru,
    getQuote,
    getUserData,
    getUserMoods,
    insertUserMood,
} from "../models/userModels.js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const STORAGE_PATH = "/storage/v1/object/public/profile_pictures/";

// Data user + hanya mood terbaru
export const dataUser = async (req, res, next) => {
    try {
        const user_id = req.user.id;
        if (!user_id)
            return res.status(400).json({ message: "user_id tidak ditemukan" });

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
            joined_date: data.created_at
                ? data.created_at.split("T")[0]
                : "Belum ada tanggal",
            latest_mood: latestMood || "Belum memilih mood",
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
        if (!user_id)
            return res.status(400).json({ message: "user_id tidak ditemukan" });

        const data = await getUserData(user_id);
        const allMoods = await getUserMoods(user_id);
        let latestMood = await ambilMoodTerbaru(user_id);

        if (latestMood?.created_at) {
            const dateObj = new Date(latestMood.created_at);

            const monthNames = [
                "Januari",
                "Februari",
                "Maret",
                "April",
                "Mei",
                "Juni",
                "Juli",
                "Agustus",
                "September",
                "Oktober",
                "November",
                "Desember",
            ];

            const month = monthNames[dateObj.getMonth()];
            const day = String(dateObj.getDate()).padStart(2, "0");
            const year = dateObj.getFullYear();

            let hours = dateObj.getHours();
            const minutes = String(dateObj.getMinutes()).padStart(2, "0");
            const ampm = hours >= 12 ? "PM" : "AM";
            hours = hours % 12;
            hours = hours ? hours : 12; 

            latestMood.created_at = `${month} ${day}, ${year} - ${hours}:${minutes} ${ampm}`;
        }

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
            joined_date: data.created_at
                ? data.created_at.split("T")[0]
                : "Belum ada tanggal",
            moods: allMoods || [],
            latest_mood: latestMood || null,
        };

        res.status(200).json(userData);
    } catch (err) {
        console.error("Gagal mengambil data user dashboard:", err.message);
        next(err);
    }
};

export const kirimUserMood = async (req, res, next) => {
    try {
        const user_id = req.user.id;
        if (!user_id)
            return res.status(400).json({ message: "user_id tidak ditemukan" });

        const { mood, note } = req.body;
        if (!mood) return res.status(400).json({ message: "Mood wajib diisi" });

        let newMood = await insertUserMood(user_id, mood, note || "");
        if (!newMood)
            return res.status(500).json({ message: "Gagal menyimpan mood" });

        if (newMood.created_at) {
            const dateObj = new Date(newMood.created_at);
            const yyyy = dateObj.getFullYear();
            const mm = String(dateObj.getMonth() + 1).padStart(2, "0"); 
            const dd = String(dateObj.getDate()).padStart(2, "0");
            const hh = String(dateObj.getHours()).padStart(2, "0");
            const min = String(dateObj.getMinutes()).padStart(2, "0");
            const sec = String(dateObj.getSeconds()).padStart(2, "0");

            newMood.created_at = `${yyyy}-${mm}-${dd} ${hh}:${min}:${sec}`;
        }

        res.status(201).json({
            message: "Mood berhasil disimpan",
            data: newMood,
        });
    } catch (err) {
        console.error("Error kirimUserMood:", err.message);
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
};


export const kirimQuote = async (req, res, next) => {
    try {
        const user_id = req.user?.id;
        if (!user_id) {
            return res.status(400).json({ message: "user_id tidak ditemukan" });
        }
        const tanggalHariIni = new Date().getDate();
        const quote = await getQuote(tanggalHariIni);
        if (!quote) {
            return res.status(500).json({ message: "Gagal mengambil mood" });
        }
        return res.status(200).json({
            message: "Quote berhasil dikirim",
            data: quote
        });

    } catch (error) {
        console.error("Error kirimUserQuote:", error.message);
        return res.status(500).json({ message: "Terjadi kesalahan server" });
    }
};