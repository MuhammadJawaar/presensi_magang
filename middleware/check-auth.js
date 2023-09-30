const jwt = require('jsonwebtoken');

function checkAuthAdmin(req, res, next){
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decodedToken;
        const userRole = decodedToken.role;
        if (userRole === 'admin'){
            next();
        }else{
            return res.status(403).json({
                'message': "bukan admin"
            });
        }
        
    }catch(error){
        return res.status(401).json({
            'message': "Invalid or expired token!",
            'error':error
        });
    }
}

function checkAuthPeserta(req, res, next){
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decodedToken;
        const userRole = decodedToken.role;
        const userId = decodedToken.pesertaid;
        const id = req.params.id;
        
        if (userRole === 'peserta_magang'){
            if(id == userId){
                next();
                
            }
            else{
                return res.status(403).json({
                    'message': "bukan admin1"
                    
                });
            }    
        }else{
            return res.status(403).json({
                'message': "bukan admins"
            });
        }
        
    }catch(error){
        return res.status(401).json({
            'message': "Invalid or expired token!",
            'error':error
        });
    }
}

module.exports = {
    checkAuthAdmin: checkAuthAdmin,
    checkAuthPeserta: checkAuthPeserta
}