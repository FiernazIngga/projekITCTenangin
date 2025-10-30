import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(403).json({
            message: 'No token provided'
        });
    }

    const parts = authHeader.split(' ');
    const token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : authHeader;

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                message: 'Unauthorized: Invalid or expired token'
            });
        }
        req.user = decoded;
        next();
    });
}

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