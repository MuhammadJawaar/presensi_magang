const models = require('../models');

const jwt = require('jsonwebtoken');

const refreshToken = async(req,res) => {
    try {
        const refreshtoken = req.cookies.refreshtoken;
        if (!refreshtoken){
            return res.status(401).json({
                'msg': "cookies bertingkah aneh"
            });
        }
        const role = req.userData.role;
        if (role === 'peserta_magang' || role === 'admin') {
            const userModel = role === 'peserta_magang' ? models.Peserta_Magang : models.Admin;
            const user = await userModel.findOne({ where: { refreshTokens: refreshtoken } });

            if (!user){
                return res.status(403).json({
                    'mesg': "ini lu bukan ?"
                });
            }
            jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET, (err,decoded) =>{
                if(err){
                    return res.status(403).json({
                        'message': "somethin went wrong "
                    });
                }
                const token = jwt.sign({
                    username: user.username,
                    userId: user.id,
                    role: role
                }, process.env.JWT_KEY, {
                    expiresIn: '15m' // Set the token expiration time (e.g., 15 minutes)
                });
                console.log(token);
            });
        }

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    refreshToken: refreshToken
};
