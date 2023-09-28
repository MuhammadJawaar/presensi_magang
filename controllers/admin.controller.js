const { Op } = require('sequelize');
const models = require('../models');
const moment = require('moment');
const Validator = require('fastest-validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

function addAdmin(req, res){
    
    const admin = {
        nama: req.body.nama,
        username: req.body.username,
        password: req.body.password
    }

    const schema = {
        nama: {type:"string", optional:false, max:50},
        username: {type:"string", optional:false, max:50},
        password: {type:"string", optional:false, max:50}
    }

    const v = new Validator();
    const validationResponse = v.validate(admin, schema);

    if(validationResponse !== true){
        return res.status(400).json({
            message: "Validation false",
            errors: validationResponse
        });
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

async function addPeserta(req, res){
    models.Admin.findOne({where:{username: req.body.username}}).then (result =>{
        if (result){
            res.status(409).json({
                message: 'dah ada email bang'
            })
        }else{
            models.Peserta_Magang.findOne({where:{username: req.body.username}}).then(result =>{
                bcryptjs.genSalt(10,async function(err,salt){
                    bcryptjs.hash(req.body.password,salt,async function(err,hash){
                        try {
                            const peserta_magang = {
                                nama: req.body.nama,
                                username: req.body.username,
                                password: hash,
                                asal_univ: req.body.asal_univ,
                                asal_jurusan: req.body.asal_jurusan,
                                tanggal_mulai: req.body.tanggal_mulai,
                                tanggal_selesai: req.body.tanggal_selesai,
                                status_aktif: req.body.status_aktif
                            }
                            const isDateOnly = (value) => {
                                // Add your custom validation logic here to check if the value is a date without a time component
                                // For example, you can use a regular expression to match date-only format (YYYY-MM-DD)
                                const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;
                                return dateOnlyRegex.test(value);
                            };
                            
                            const schema = {
                                nama: { type: "string", optional: false, max: 50 },
                                username: { type: "string", optional: false, max: 50 },
                                password: { type: "string", optional: false},
                                asal_univ: { type: "string", optional: false, max: 50 },
                                asal_jurusan: { type: "string", optional: false, max: 50 },
                                tanggal_mulai: { type: "custom", messages: { custom: "Invalid date format" }, check: isDateOnly },
                                tanggal_selesai: { type: "custom", messages: { custom: "Invalid date format" }, check: isDateOnly },
                                status_aktif: { type: "boolean" } // Validate as a boolean
                            };
                            console.log("cek");
                            const v = new Validator();
                            const validationResponse = v.validate(peserta_magang, schema);
                            console.log("cek2");
                            if(validationResponse !== true){
                                return res.status(400).json({
                                    message: "Validation false",
                                    errors: validationResponse
                                });
                            }else{
                                console.log("cek3");
                                const result_peserta = await models.Peserta_Magang.create(peserta_magang);
                                const pid = peserta_magang.id; 
                                await addPresensiForPeserta(result_peserta, req, res);
                            }
                            
                        }catch(error){
                            res.status(500).json({
                                message: "Something went wrong",
                                error:error
                            });
                        }    
                    });
                });
            }).catch(error=>{
                res.status(500).json({
                    message: "Something went wrong",
                    error:error
                });
            });                           
        }
    }).catch(error=>{
        res.status(500).json({
            message: "Something went wrong",
            error:error
        });
    });
}

async function addPresensiForPeserta(result_peserta, req, res){
    try {
        //result_peserta.tanggal_mulai
        const tanggalMulai = moment(result_peserta.tanggal_mulai);
        const tanggalBerakhir = moment(result_peserta.tanggal_selesai);
        
        let selisihHari = 0;
        const presensiData = [];

        while (tanggalMulai.isBefore(tanggalBerakhir)) {
            if (tanggalMulai.day() !== 0 && tanggalMulai.day() !== 6) {
              selisihHari++;
              const presensi = {
                p_id: result_peserta.id,
                tanggal: tanggalMulai.format('YYYY-MM-DD')
              };
              presensiData.push(presensi);
            }
            tanggalMulai.add(1, 'days');
        }
        
        await models.Presensi.bulkCreate(presensiData);
    
        res.status(201).json({
          message: "Presensi created successfully"
        });
      } catch (error) {
        res.status(500).json({
          message: "Something went wrong2",
          error: error
        });
      }
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
    bcryptjs.genSalt(10,async function(err,salt){
        bcryptjs.hash(req.body.password,salt,async function(err,hash){
            try {
                const id = req.params.id;
                const updatedPeserta = {
                    nama: req.body.nama,
                    username: req.body.username,
                    password: hash,
                    asal_univ: req.body.asal_univ,
                    asal_jurusan: req.body.asal_jurusan,
                    tanggal_mulai: req.body.tanggal_mulai,
                    tanggal_selesai: req.body.tanggal_selesai,
                    status_aktif: req.body.status_aktif
                }
                const schema = {
                    nama: {type:"string", optional:false, max:50},
                    username: {type:"string", optional:false, max:50},
                    password: {type:"string", optional:false, max:50},
                    asal_univ: {type:"string", optional:false, max:50},
                    asal_jurusan: {type:"string", optional:false, max:50},
                    tanggal_mulai: {type:"datetime", optional:false},
                    tanggal_selesai: {type:"datetime", optional:false},
                    status_aktif: {type:"boolean", optional:false},
                }

                const v = new Validator();
                const validationResponse = v.validate(udpatePeserta, schema);
                
                if(validationResponse !== true){
                    return res.status(400).json({
                        message: "Validation false",
                        errors: validationResponse
                    });
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
            } catch (error){
                res.status(500).json({
                    message: "Something went wrong",
                    error:error
                });
            }
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

async function showPresensiBelum(req, res){
    const currentDate = new Date();
    const tanggal = moment(currentDate);
    const presensi = await models.Peserta_Magang.findAll({
        include:[{
            model: models.Presensi,
            as:'presensimagang',
            where: {
                tanggal:tanggal.format('YYYY-MM-DD'),[Op.or]: [
                { check_in: null },
                { check_out: null },
            ]}
        }]
    });
        res.status(200).json({
            presensi:presensi
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
        const schema = {
            judul: {type:"string", optional:false, max:50},
            tugas_url: {type:"string", optional:false, max:50},
            dueDate: {type:"date", optional:false}
        }

        const v = new Validator();
        const validationResponse = v.validate(tugas, schema);

        if(validationResponse !== true){
            return res.status(400).json({
                message: "Validation false",
                errors: validationResponse
            });
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
          status_pengerjaan: false
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

module.exports = {
    addAdmin:addAdmin,
    addPeserta:addPeserta,
    showPeserta:showPeserta,
    showPesertaAll:showPesertaAll,
    editPeserta:editPeserta,
    deletePeserta:deletePeserta,
    showPresensiPerDay:showPresensiPerDay,
    showPresensiBelum:showPresensiBelum,
    showPresensiPerPeserta:showPresensiPerPeserta,
    showTugas:showTugas,
    showTugasAll:showTugasAll,
    showTugasStatusByTugas:showTugasStatusByTugas,
    addTugas:addTugas,
    deleteTugas:deleteTugas,
}