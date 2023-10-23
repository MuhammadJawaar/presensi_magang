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

            const refreshToken = jwt.sign({
                nama: user.nama,
                username: user.username,
                userId: user.id,
                role: role
            }, process.env.REFRESH_TOKEN_SECRET, {
                expiresIn: '7d' // Set the refresh token expiration time (e.g., 7 days)
            });

            // Update the refreshTokens in the database
            await user.update({refreshTokens: refreshToken},{
                where:{
                    id: user.id
                }
            })
            res.cookie('refreshtoken', refreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            res.status(200).json({
                message: "Berhasil autentikasi",
                token: token,
                refreshToken: refreshToken
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
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        const role = decodedToken.role;
        const refreshToken = req.cookies.refreshtoken;

        if (!refreshToken) {
            return res.status(204).json({ message: "Token penyegar tidak ditemukan." });
        }

        if (role === 'peserta_magang' || role === 'admin') {
            const userModel = role === 'peserta_magang' ? models.Peserta_Magang : models.Admin;
            const user = await userModel.findOne({ where: { refreshTokens: refreshToken } });

            if (!user) {
                return res.status(204).json({ message: "Anda sudah logout sebelumnya." });
            }

            // Lakukan perbaruan di database untuk menghapus refresh token
            await userModel.update({ refreshTokens: null }, { where: { id: user.id } });

            // Hapus cookie refresh token
            res.clearCookie('refreshtoken');

            return res.status(200).json({ message: "Logout berhasil." });
        } else {
            return res.status(400).json({ message: "Peran tidak didukung." });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Terjadi kesalahan saat logout.", error: error });
    }
}

const refreshToken = async (req, res) => {
    try {
        const refreshTokenCookie = req.cookies.refreshtoken; // Ganti nama variabel agar tidak konflik
        if (!refreshTokenCookie) {
            return res.status(401).json({
                message: "Missing or invalid refresh token"
            });
        }

        // Periksa token dengan jwt.verify
        jwt.verify(refreshTokenCookie, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    message: "Invalid refresh token"
                });
            }

            const user = await models.Peserta_Magang.findOne({ where: { refreshTokens: refreshTokenCookie } }) || await models.Admin.findOne({ where: { refreshTokens: refreshTokenCookie } });
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