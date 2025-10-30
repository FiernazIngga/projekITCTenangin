import fs from "fs";
import path from "path";
import { __dirname, bukaFile } from "../utils/dirname.js";
import {
    ambilNewAccessToken,
    loginUser,
    logout,
    registerUser,
} from "../models/authModels.js";


// ==========================
// REGISTER USER
export const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name)
            return res.status(400).json({ message: "Semua field wajib diisi" });

        await registerUser(email, password, name);
        res.status(201).json({ message: "Registrasi berhasil" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// ==========================
// LOGIN USER
export const login = async (req, res) => {
    try {
        const { accessToken, refreshToken, user } = await loginUser(req, res);

        // Gunakan cookie yang aman di Vercel
        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 3 * 24 * 60 * 60 * 1000, // 3 hari
        });

        res.status(200).json({
            message: "Login berhasil",
            accessToken,
            user,
        });
    } catch (err) {
        console.error("Error saat login:", err.message);
        res.status(400).json({
            message: err.message || "Terjadi kesalahan server",
        });
    }
};

// ==========================
// REFRESH TOKEN
export const refreshTokenUser = async (req, res) => {
    const { id_user } = req.body;
    if (!id_user)
        return res.status(400).json({ error: "User ID diperlukan" });

    try {
        const newAccessToken = await ambilNewAccessToken(id_user);
        res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
        console.error("Error refresh token:", err.message);
        res.status(403).json({ error: "Refresh token invalid atau expired" });
    }
};

// ==========================
// LOGOUT USER
export const logoutUser = async (req, res) => {
    const { id_user } = req.body;
    if (!id_user)
        return res.status(400).json({ error: "User ID diperlukan" });

    try {
        await logout(id_user);

        const isProduction = process.env.NODE_ENV === "production";

        res.clearCookie("refresh_token", {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
        });

        res.status(200).json({ message: "Logout berhasil" });
    } catch (err) {
        console.error("Error logout:", err.message);
        res.status(500).json({ error: err.message });
    }
};
