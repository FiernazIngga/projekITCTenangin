import { supabase } from "../databases/supabaseClient.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Daftar user baru
export const registerUser = async (email, password, name) => {
    // Cek apakah user sudah ada
    const { data: emailUser } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

    // Cek username
    const { data: usernameUser } = await supabase
        .from("users")
        .select("*")
        .eq("username", name)
        .single();

    if (emailUser) throw new Error("Email sudah terdaftar");
    if (usernameUser) throw new Error("Username sudah terdaftar");

    // Simpan user baru tanpa hashing
    const { data, error } = await supabase
        .from("users")
        .insert([{ email, password, username: name }])
        .select()
        .single();

    if (error) throw error;
    return data;
};

// Login user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1️⃣ Validasi input
        if (!email || !password) {
            throw new Error("Email dan password wajib diisi");
        }

        // 2️⃣ Cek user berdasarkan username
        const { data: user, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single();

        if (error || !user) {
            throw new Error("Email tidak ditemukan");
        }

        // 3️⃣ Cocokkan password polos (kalau belum pakai hash)
        if (user.password !== password) {
            throw new Error("Password salah");
        }

        // 4️⃣ Hapus data sensitif sebelum dimasukkan ke token
        const { password: _, refresh_token: __, ...safeUserData } = user;

        // 5️⃣ Buat Access Token
        const accessToken = jwt.sign(
            safeUserData,
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "5m" }
        );

        // 6️⃣ Buat Refresh Token
        const refreshToken = jwt.sign(
            safeUserData,
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1h" }
        );
        console.log("Secret saat sign:", process.env.ACCESS_TOKEN_SECRET);
        // 7️⃣ Simpan refresh token ke database
        const { error: updateError } = await supabase
            .from("users")
            .update({ refresh_token: refreshToken })
            .eq("email", user.email);

        if (updateError) {
            throw new Error("Gagal menyimpan refresh token");
        }

        // ✅ Berhasil login → return hasilnya ke controller
        return { accessToken, refreshToken, user: safeUserData };
    } catch (err) {
        // ❌ Kalau ada error, lempar ke controller
        throw err;
    }
};

export const ambilNewAccessToken = async (userId) => {
    if (!userId) throw new Error("User ID diperlukan");

    // Ambil refresh token dari database
    const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

    if (error || !user?.refresh_token) {
        throw new Error("Refresh token tidak ditemukan");
    }

    // Verifikasi refresh token
    let payload;
    try {
        payload = jwt.verify(
            user.refresh_token,
            process.env.REFRESH_TOKEN_SECRET
        );
    } catch (err) {
        throw new Error("Refresh token invalid atau expired");
    }

    // Buang data sensitif sebelum buat access token
    const { password: _, refresh_token: __, ...safeUserData } = user;

    // Buat access token baru dengan safeUserData
    const newAccessToken = jwt.sign(
        safeUserData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "5m" }
    );

    return newAccessToken; // kembalikan ke controller
};

export const logout = async (userId) => {
    if (!userId) throw new Error("User ID diperlukan");

    // Hapus refresh token dari tabel users
    const { error } = await supabase
        .from("users")
        .update({ refresh_token: null })
        .eq("id", userId);

    if (error) {
        throw new Error("Gagal logout: " + error.message);
    }

    return true; // sukses
};
