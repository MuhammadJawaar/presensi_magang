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

function showPeserta(req, res){
    const id = req.params.id;

    models.Peserta_Magang.findByPk(id).then(result =>{
        res.status(200).json({
            peserta_magang:result
        });
    }).catch(error =>{
        res.status(500).json({
            message: "Something went wrong",
            error:error
        });
    });
}

function showPesertaAll(req, res){
    models.Peserta_Magang.findAll().then(result =>{
        res.status(200).json({
            peserta_magang:result
        });
    }).catch(error =>{
        res.status(500).json({
            message: "Something went wrong",
            error:error
        });
    });
}

function editPeserta(req,res){
    const id = req.params.id;
    const updatedPeserta = {
        nama: req.body.nama,
        username: req.body.username,
        password: req.body.password,
        asal_univ: req.body.asal_univ,
        asal_jurusan: req.body.asal_jurusan,
        tanggal_mulai: req.body.tanggal_mulai,
        tanggal_selesai: req.body.tanggal_selesai,
        status_aktif: req.body.status_aktif
    }

    models.Peserta_Magang.update(updatedPeserta, {where:{id:id}}).then(result =>{
        res.status(200).json({
            message: "Peserta Magang updated successfully"
        });
    }).catch(error =>{
        res.status(500).json({
            message: "Something went wrong",
            error:error
        });
    });
}

function deletePeserta(req, res){
    const id = req.params.id;

    models.Peserta_Magang.destroy({where:{id:id}}).then(result =>{
        res.status(200).json({
            message: "Peserta Magang deleted"
        });
    }).catch(error =>{
        res.status(500).json({
            message: "Something went wrong",
            error:error
        });
    });
}

function showPresensiAll(req, res){
    models.Presensi.findAll().then(result =>{
        res.status(200).json({
            presensi:result
        });
    }).catch(error =>{
        res.status(500).json({
            message: "Something went wrong",
            error:error
        });
    });
}

function showTugas(req, res){
    const id = req.params.id;

    models.Tugas.findByPk(id).then(result =>{
        res.status(200).json({
            tugas:result
        });
    }).catch(error =>{
        res.status(500).json({
            message: "Something went wrong",
            error:error
        });
    });
}

function showTugasAll(req, res){
    models.Tugas.findAll().then(result =>{
        res.status(200).json({
            tugas:result
        });
    }).catch(error =>{
        res.status(500).json({
            message: "Something went wrong",
            error:error
        });
    });
}

function addTugas(req, res){
    const tugas = {
        judul: req.body.judul,
        tugas_url: req.body.tugas_url,
        dueDate: req.body.dueDate
    }
    models.Tugas.create(tugas).then(result => {
        res.status(201).json({
            message: "Tugas created successfully"
        });
    }).catch(error =>{
        res.status(500).json({
            message: "Something went wrong",
            error:error
        });
    });
}

function deleteTugas(req, res){
    const id = req.params.id;

    models.Tugas.destroy({where:{id:id}}).then(result =>{
        res.status(200).json({
            message: "Peserta Magang deleted"
        });
    }).catch(error =>{
        res.status(500).json({
            message: "Something went wrong",
            error:error
        });
    });
}

function showTugasStatus(){
    models.Status_tugas.findAll().then(result =>{
        res.status(200).json({
            tugas:result
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
    addPeserta:addPeserta,
    showPeserta:showPeserta,
    showPesertaAll:showPesertaAll,
    editPeserta:editPeserta,
    deletePeserta:deletePeserta,
    showPresensiAll:showPresensiAll,
    showTugasAll:showTugasAll,
    addTugas:addTugas,
    showTugas:showTugas,
    deleteTugas:deleteTugas,
    showTugasStatus:showTugasStatus
}