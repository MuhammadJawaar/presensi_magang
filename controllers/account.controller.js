const models = require('../models');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function login(req, res) {
    try {
        const role = req.body.role;
        if (role === 'peserta_magang' || role === 'admin') {
            const userModel = role === 'peserta_magang' ? models.Peserta_Magang : models.Admin;

            const user = await userModel.findOne({ where: { username: req.body.username } });
            if (!user) {
                return res.status(401).json({
                    message: 'Email atau password salah',
                });
            }

            const passwordMatch = await bcryptjs.compare(req.body.password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({
                    message: 'Email atau password salah',
                });
            }

            const token = jwt.sign({
                nama: user.nama,
                username: user.username,
                userId: user.id,
                role: role
            }, process.env.JWT_KEY, {
                expiresIn: '15m' // Set the token expiration time (e.g., 15 minutes)
            });
            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 15 * 60 * 1000 // 15 menit
            });

            res.status(200).json({
                message: "Berhasil autentikasi",
                token: token,
            });            

        } else {
            res.status(400).json({
                message: 'Role not supported',
            });
        }

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            message: 'Terjadi kesalahan saat login',
        });
    }
}
async function logout(req, res) {
    try {
        // Periksa token akses dalam header
        const refreshToken = req.cookies.token;
        
        if (!refreshToken) {
            return res.status(204).json({ message: "Token penyegar tidak ditemukan." });
        }
        jwt.verify(refreshToken, process.env.JWT_KEY, async (err,decodedToken) =>{
            if (err){
                res.clearCookie('token');
                return res.status(403).json({
                    message: "token invalid"
                });
            }
            const role = decodedToken.role;
            const username = decodedToken.username;

            if (role === 'peserta_magang' || role === 'admin') {
                const userModel = role === 'peserta_magang' ? models.Peserta_Magang : models.Admin;
                const user = await userModel.findOne({ where: { username: username } });
    
                if (!user) {
                    return res.status(204).json({ message: "Anda sudah logout sebelumnya." });
                }
    
                res.clearCookie('token');
    
                return res.status(200).json({ message: "Logout berhasil." });
            } else {
                return res.status(400).json({ message: "Peran tidak didukung." });
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Terjadi kesalahan saat logout.", error: error });
    }
}

const refreshToken = async (req, res) => {
    try {
        const refreshTokenCookie = req.cookies.token; // Ganti nama variabel agar tidak konflik
        if (!refreshTokenCookie) {
            return res.status(401).json({
                message: "Missing or invalid refresh token"
            });
        }

        // Periksa token dengan jwt.verify
        jwt.verify(refreshTokenCookie, process.env.JWT_KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    message: "Invalid refresh token"
                });
            }

            const user = await models.Peserta_Magang.findOne({ where: { username: decoded.username } }) || await models.Admin.findOne({ where: { username: decoded.username } });
            if (!user) {
                return res.status(403).json({
                    message: "Invalid user"
                });
            }

            // Di sini, pastikan Anda memiliki akses ke nilai "role" dari decoded token
            const newToken = jwt.sign({
                nama: user.nama,
                username: user.username,
                userId: user.id,
                role: decoded.role // Pastikan Anda mendapatkan "role" dengan benar
            }, process.env.JWT_KEY, {
                expiresIn: '15m'
            });

            res.status(200).json({
                token: newToken
            });
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
}



module.exports = {
    login: login,
    logout:logout,
    refreshToken:refreshToken
};