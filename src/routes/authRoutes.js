import express from 'express';
const router = express.Router();

import { login, logoutUser, refreshTokenUser, register } from '../controllers/authController.js';

// ==========================
// Route register user
// URL: /register
// Method: POST
// Body: { email, password, name }
// Deskripsi: Mendaftarkan user baru
// Response 201: { message: "Registrasi berhasil" }
// Response 400: { message: "Semua field wajib diisi" }
// Response 401: { message: "Email/Username sudah terdaftar" }
router.post("/register", register);

// ==========================
// Route login user
// URL: /login
// Method: POST
// Body: { name, password }
// Deskripsi: Login user, mengembalikan accessToken, refreshToken, dan data user
// Response 200: { message: "Login berhasil", accessToken, user }
// Response 400: { message: "Error login / invalid credentials" }
router.post("/login", login);

// ==========================
// Route refresh access token
// URL: /refresh/:userId
// Method: GET
// Params: userId (URL param)
// Deskripsi: Mengambil access token baru menggunakan refresh token dari database
// Response 200: { accessToken }
// Response 400: { error: "User ID diperlukan" }
// Response 403: { error: "Refresh token invalid atau expired" }
router.get("/refresh/:userId", refreshTokenUser);

// ==========================
// Route logout user
// URL: /logout/:userId
// Method: GET
// Params: userId (URL param)
// Deskripsi: Logout user, menghapus refresh token di database dan cookie
// Response 200: { message: "Logout berhasil" }
// Response 400: { error: "User ID diperlukan" }
// Response 500: { error: "Gagal logout / error server" }
router.get("/logout/:userId", logoutUser);

export default router;

// authRoutes.js
// ==========================
// Deskripsi: Router untuk autentikasi user
// Routes utama:
//   - GET / → mainPage
//   - POST /register → register user
//   - POST /login → login user
//   - GET /refresh/:userId → ambil access token baru
//   - GET /logout/:userId → logout user
