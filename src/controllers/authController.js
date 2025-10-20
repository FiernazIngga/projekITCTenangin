import fs from "fs";
import path from "path";
import { __dirname, bukaFile } from "../utils/dirname.js";
import {
    ambilNewAccessToken,
    loginUser,
    logout,
    registerUser,
} from "../models/authModels.js";

export const mainPage = (req, res) => {
    // bukaFile(res, 'mainPage.html','../view') // Untuk route ke htmlnya
    res.send("Hello World");
};

// mainPage
// ==========================
// Deskripsi: Endpoint utama untuk testing server / main page
// Response: text "Hello World"
// Method: GET
// Route: /

export const register = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name)
            return res.status(400).json({ message: "Semua field wajib diisi" });

        const newUser = await registerUser(email, password, name);
        res.status(201).json({ message: "Registrasi berhasil" });
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
};

// register
// ==========================
// Deskripsi: Mendaftarkan user baru ke database Supabase
// Request body: { email, password, name }
// Response 201: { message: "Registrasi berhasil" }
// Response 400/401: { message: "Email sudah terdaftar" / "Username sudah terdaftar" }
// Model: registerUser

export const login = async (req, res) => {
    try {
        const { accessToken, refreshToken, user } = await loginUser(req, res);

        // Simpan refresh token di cookie
        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 3 * 24 * 60 * 60 * 1000,
        });

        // Kirim respon sukses
        return res.status(200).json({
            message: "Login berhasil",
            accessToken,
            user,
        });
    } catch (err) {
        // Tangani semua error yang dilempar dari model
        console.error("Error saat login:", err.message);
        return res.status(400).json({
            message: err.message || "Terjadi kesalahan server",
        });
    }
};

// login
// ==========================
// Deskripsi: Login user dan generate access token + refresh token
// Request body: { name, password }
// Response 200: { message: "Login berhasil", accessToken, user }
// Response 400/401: { message: "Nama tidak ditemukan" / "Password salah" }
// Catatan: refresh token disimpan di cookie httpOnly

export const refreshTokenUser = async (req, res) => {
    const { userId } = req.params; // ambil dari URL param
    if (!userId) return res.status(400).json({ error: "User ID diperlukan" });

    try {
        // panggil async function dan tunggu hasilnya
        const newAccessToken = await ambilNewAccessToken(userId);

        res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
        console.error("Error refresh token:", err.message);
        res.status(403).json({ error: "Refresh token invalid atau expired" });
    }
};

// refreshTokenUser
// ==========================
// Deskripsi: Mendapatkan access token baru menggunakan refresh token yang tersimpan di DB
// Params: userId
// Response 200: { accessToken }
// Response 403: { error: "Refresh token invalid atau expired" }
// Model: ambilNewAccessToken

export const logoutUser = async (req, res) => {
    const { userId } = req.params;

    if (!userId) return res.status(400).json({ error: "User ID diperlukan" });

    try {
        await logout(userId);
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
        });
        res.status(200).json({ message: "Logout berhasil" });
    } catch (err) {
        console.error("Error logout:", err.message);
        res.status(500).json({ error: err.message });
    }
};

// logoutUser
// ==========================
// Deskripsi: Logout user → hapus refresh token dari DB + hapus cookie
// Params: userId
// Response 200: { message: "Logout berhasil" }
// Response 400: { error: "User ID diperlukan" }
// Response 500: { error: "Gagal logout" }
// Model: logout