import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(403).json({
            message: 'No token provided' // 🔹 Tidak ada token
        });
    }

    const parts = authHeader.split(' ');
    const token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : authHeader;

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({
                    message: 'Token expired' // 🔹 Token kadaluarsa
                });
            } else if (err.name === "JsonWebTokenError") {
                return res.status(401).json({
                    message: 'Invalid token' // 🔹 Token salah / tidak valid
                });
            } else {
                return res.status(401).json({
                    message: 'Unauthorized'
                });
            }
        }

        // Jika token valid
        req.userId = decoded.id;
        next();
    });
};


// verifyToken
// ==========================
// Deskripsi: Middleware untuk memverifikasi JWT access token
// Request: Header 'Authorization': 'Bearer <token>'
// Response 401: { message: 'Unauthorized: Invalid or expired token' }
// Response 403: { message: 'No token provided' }
// Behavior: 
//   - Jika token valid, simpan decoded.id ke req.userId
//   - Lanjut ke route berikutnya dengan next()
// Catatan: ACCESS_TOKEN_SECRET harus sudah didefinisikan di .env