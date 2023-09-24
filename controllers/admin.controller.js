const models = require('../models');

function addAdmin(req, res){
    const admin = {
        nama: req.body.nama,
        username: req.body.username,
        password: req.body.password
    }
    models.Admin.create(admin).then(result => {
        res.status(201).json({
            message: "admin created successfully"
        });
    }).catch(error =>{
        res.status(500).json({
            message: "Something went wrong",
            error:error
        });
    });
}

function addPeserta(req, res){
    const peserta_magang = {
        nama: req.body.nama,
        username: req.body.username,
        password: req.body.password,
        asal_univ: req.body.asal_univ,
        asal_jurusan: req.body.asal_jurusan,
        tanggal_mulai: req.body.tanggal_mulai,
        tanggal_selesai: req.body.tanggal_selesai,
        status_aktif: req.body.status_aktif
    }
    models.Peserta_Magang.create(peserta_magang).then(result => {
        res.status(201).json({
            message: "Peserta Magang created successfully"
        });
    }).catch(error =>{
        res.status(500).json({
            message: "Something went wrong",
            error:error
        });
    });
}

module.exports = {
    addAdmin:addAdmin,
    addPeserta:addPeserta
}