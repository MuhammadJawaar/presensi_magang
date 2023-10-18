const models = require('../models');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

function login(req, res) {
    const role = req.body.role;
    if (role === 'peserta_magang' || role === 'admin') {
        const userModel = role === 'peserta_magang' ? models.Peserta_Magang : models.Admin;

        userModel.findOne({ where: { username: req.body.username } }).then(user => {
            if (user === null) {
                res.status(401).json({
                    message: 'email atau password salah',
                });
            } else {
                bcryptjs.compare(req.body.password, user.password, function(err, result) {
                    if (result) {
                        const token = jwt.sign({
                            username: user.username,
                            userId: user.id, // Change pesertaid to userId
                            role: role
                        }, process.env.JWT_KEY, {
                            expiresIn: '1h' // Set the expiration time (e.g., 1 hour)
                        });

                        const refreshToken = jwt.sign({
                            username: user.username,
                            userId: user.id,
                            role: role
                        }, process.env.REFRESH_TOKEN_SECRET, {
                            expiresIn: '7d' // Set the refresh token expiration time (e.g., 7 days)
                        });

                        // Simpan refresh token di server
                        refreshTokens[refreshToken] = user.id;

                        res.status(200).json({
                            message: "berhasil autentikasi",
                            token: token,
                            refreshToken: refreshToken
                        });

                    } else {
                        res.status(401).json({
                            message: 'email atau password salah',
                        });
                    }
                });
            }
        }).catch(error => {
            res.status(500).json({
                message: 'email atau password salah',
            });
        });
    } else {
        res.status(400).json({
            message: 'Role not supported',
        });
    }
}

module.exports = {
    login: login
}