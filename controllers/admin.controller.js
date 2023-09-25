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
    models.Presensi.findAll({where:{status_aktif: true}}).then(result =>{
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

function showPresensiPerDay(req, res){
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    models.Presensi.findAll({where:{createdAt: currentDate}}).then(result =>{
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

function showPresensiPerDayBelum(req, res){
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    pid = models.Peserta_Magang.findAll({where:{}})
    
    models.Presensi.findAll({where:{p_id:pid}}).then(result =>{
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

function showPresensiPerPeserta(req, res){
    const pid = req.params.id;

    models.Presensi.findAll({where:{p_id: pid}}).then(result =>{
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

function showTugasStatusByTugas(req, res){
    const tid = req.params.id;
    models.Status_tugas.findAll({where:{t_id:tid}}).then(result =>{
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



async function addTugas(req, res) {
    try {
      const tugas = {
        judul: req.body.judul,
        tugas_url: req.body.tugas_url,
        dueDate: req.body.dueDate
      }
  
      // Create the tugas record and await the result
      const result_tugas = await models.Tugas.create(tugas);
  
      // Call the addStatusToAll function with result_tugas
      await addStatusToAll(result_tugas, req, res);
    } catch (error) {
      res.status(500).json({
        message: "Something went wrong1",
        error: error
      });
    }
}

async function addStatusToAll(result_tugas, req, res) {
    try {
      const peserta = await models.Peserta_Magang.findAll({ where: { status_aktif: true } });
  
      for (let i = 0; i < peserta.length; i++) {
        const status_tugas = {
          p_id: peserta[i].id, // Use peserta[i].id to get the id of each peserta
          t_id: result_tugas.id, // Use the result_tugas from addTugas function
          tugas_url: null,
          status_pengerjaan: false,
          status_verifikasi: false
        }
  
        // Create the status_tugas record for each peserta
        await models.Status_tugas.create(status_tugas);
      }
  
      res.status(201).json({
        message: "Status tugas created successfully"
      });
    } catch (error) {
      res.status(500).json({
        message: "Something went wrong2",
        error: error
      });
    }
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

function showTugasStatus(){ //ini biar find by t_id
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