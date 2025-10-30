import { fetchUserData } from "../models/userModels.js";

export const dataUser = async (req, res, next) => {
    try {
        const { user_id } = req.user.id_user;
        if (!user_id) {
            return res.status(400).json({ message: "user_id tidak ditemukan" });
        }
        const data = await fetchUserData(user_id);
        const SUPABASE_URL = "https://hmrznbfwznbwehcmffmx.supabase.co";
        const STORAGE_PATH = "/storage/v1/object/public/profile_pictures/";

        const userData = {
            ...data,
            foto_profile_url: data.foto_profile
                ? `${SUPABASE_URL}${STORAGE_PATH}${data.foto_profile}`
                : null,
        };

        res.status(200).json(userData);
    } catch (err) {
        console.error("Gagal mengambil data user:", err.message);
        next(err);
    }
};

// {
//   "id": 1,
//   "foto_profile": "img2.png",
//   "username": "finz",
//   "email": "finz@gmail.com",
//   "password": "123",
//   "foto_profile_url": "https://hmrznbfwznbwehcmffmx.supabase.co/storage/v1/object/public/profile_pictures/img2.png"
// }
