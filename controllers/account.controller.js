const models = require('../models');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');


function login(req, res){
    const role = req.body.role
    if (role == 'peserta_magang'){
        models.Peserta_Magang.findOne({where:{username:req.body.username}}).then(peserta => {
            if (peserta == null){
                res.status(401).json({
                    message: 'email atau password salah',
                });
            }else{
                bcryptjs.compare(req.body.password, peserta.password, function(err, result){
                    if (result){
                        const token = jwt.sign({
                            username: peserta.username,
                            pesertaid: peserta.id
                        },'secret', function(err,token){
                            res.status(200).json({
                                message: "berhasil autentikasi",
                                token:token
                            })
                        }) 
                    }else{
                        res.status(401).json({
                            message: 'email atau password salah',
                        });
                    }
                })
            }
    
        }).catch(error => {
            res.status(500).json({
                message: 'email atau password salah',
            });
        })          
        }else{
        models.Admin.findOne({where:{username:req.body.username}}).then(peserta => {
            if (peserta == null){
                res.status(401).json({
                    message: 'email atau password salah',
                });
            }else{
                bcryptjs.compare(req.body.password, peserta.password, function(err, result){
                    if (result){
                        const token = jwt.sign({
                            username: peserta.username,
                            pesertaid: peserta.id
                        },'secret', function(err,token){
                            res.status(200).json({
                                message: "berhasil autentikasi",
                                token:token
                            })
                        }) 
                    }else{
                        res.status(401).json({
                            message: 'email atau password salah',
                        });
                    }
                })
            }
    
        }).catch(error => {
            res.status(500).json({
                message: 'email atau password salah',
            });
        })
    }
   
}

module.exports = {
    login:login
}