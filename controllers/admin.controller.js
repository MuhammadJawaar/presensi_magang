const { Op } = require('sequelize');
const Sequelize = require('sequelize');
const models = require('../models');
const moment = require('moment-timezone');
const Validator = require('fastest-validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const exceljs = require('exceljs');
const fs = require('fs');
const axios = require('axios');

function addAdmin(req, res,){
    models.Admin.findOne({where:{username: req.body.username}}).then(result =>{
        if (result){
            res.status(409).json({
                message: 'dah ada email bang'
            })        
        }else{
            models.Peserta_Magang.findOne({where:{username: req.body.username}}).then(result =>{
                if (result){
                    res.status(409).json({
                        message: 'dah ada email bang'
                    })
                }else{
                    bcryptjs.genSalt(10,async function(err,salt){
                        bcryptjs.hash(req.body.password,salt,async function(err,hash){
                            const admin = {
                                nama: req.body.nama,
                                username: req.body.username,
                                password: hash
                            }
                        
                            const schema = {
                                nama: {type:"string", optional:false, max:50},
                                username: {type:"string", optional:false, max:50},
                                password: {type:"string", optional:false}
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
                    
                        })
                    })
                }
            }).catch(error =>{
                res.status(500).json({
                    message: "Something went wrong",
                    error:error
                });
            })
        }
    }).catch(error =>{
        res.status(500).json({
            message: "Something went wrong",
            error:error
        });
    })   
}

function editAdmin(req, res){
    models.Admin.findOne({where:{username: req.body.username}}).then(result =>{
        if (result){
            res.status(409).json({
                message: 'dah ada email bang'
            })        
        }else{
            models.Peserta_Magang.findOne({where:{username: req.body.username}}).then(result =>{
                if (result){
                    res.status(409).json({
                        message: 'dah ada email bang'
                    })
                }else{
                    bcryptjs.genSalt(10,async function(err,salt){
                        bcryptjs.hash(req.body.password,salt,async function(err,hash){
                            const admin = {
                                nama: req.body.nama,
                                username: req.body.username,
                                password: hash
                            }
                        
                            const schema = {
                                nama: {type:"string", optional:false, max:50},
                                username: {type:"string", optional:false, max:50},
                                password: {type:"string", optional:false}
                            }
                        
                            const v = new Validator();
                            const validationResponse = v.validate(admin, schema);
                        
                            if(validationResponse !== true){
                                return res.status(400).json({
                                    message: "Validation false",
                                    errors: validationResponse
                                });
                            }
                        
                            models.Admin.update(admin, {where:{id:req.params.id}}).then(result => {
                                res.status(201).json({
                                    message: "admin updated successfully"
                                });
                            }).catch(error =>{
                                res.status(500).json({
                                    message: "Something went wrong1",
                                    error:error
                                });
                            });        
                    
                        })
                    })
                }
            }).catch(error =>{
                res.status(500).json({
                    message: "Something went wrong2",
                    error:error
                });
            })
        }
    }).catch(error =>{
        res.status(500).json({
            message: "Something went wrong",
            error:error
        });
    })
}

async function addPeserta(req, res){
    models.Admin.findOne({where:{username: req.body.username}}).then (result =>{
        if (result){
            res.status(409).json({
                message: 'dah ada email bang'
            })
        }else{
            models.Peserta_Magang.findOne({where:{username: req.body.username}}).then(result =>{
                if(result){
                    res.status(409).json({
                        message: 'dah ada email bang'
                    })                    
                }else{
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
                                status_aktif: { type: "boolean" } // Validate as a boolean
                            };
                            const v = new Validator();
                            const validationResponse = v.validate(peserta_magang, schema);
                            if(validationResponse !== true){
                                return res.status(400).json({
                                    message: "Validation false",
                                    errors: validationResponse
                                });
                            }else{
                                const result_peserta = await models.Peserta_Magang.create(peserta_magang);
                                await addPresensiForPeserta(result_peserta, req, res);
                            }
                            
                        }catch(error){
                            res.status(500).json({
                                message: "Something went wrong1",
                                error:error
                            });
                        }    
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

async function showPesertaAll(req, res){
    statusCheck(req, res);
    await models.Peserta_Magang.findAll().then(result =>{
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

async function editPresensiForPeserta(result_peserta,id, req, res) {
    try {
        const tanggalMulai = moment(result_peserta.tanggal_mulai);
        const tanggalBerakhir = moment(result_peserta.tanggal_selesai);
        
        const presensiData = [];

        while (tanggalMulai.isBefore(tanggalBerakhir)) {
            if (tanggalMulai.day() !== 0 && tanggalMulai.day() !== 6) {
                const existingPresensi = await models.Presensi.findOne({
                    where: {
                        p_id: id,
                        tanggal: tanggalMulai.format('YYYY-MM-DD')
                    }
                });

                if (!existingPresensi) {
                    const presensi = {
                        p_id: id,
                        tanggal: tanggalMulai.format('YYYY-MM-DD')
                    };
                    presensiData.push(presensi);
                }
            }
            tanggalMulai.add(1, 'days');
        }
        
        if (presensiData.length > 0) {
            await models.Presensi.bulkCreate(presensiData);
            res.status(201).json({
                message: "Presensi created successfully"
            });
        } else {
            res.status(200).json({
                message: "Presensi already exists for the specified dates"
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error
        });
    }
}

async function editPeserta(req,res){
    bcryptjs.genSalt(10,async function(err,salt){
        bcryptjs.hash(req.body.password,salt,async function(err,hash){
            try {
                const id = req.params.id;
                const updatedPeserta = {
                    nama: req.body.nama,
                    username: req.body.username,
                    asal_univ: req.body.asal_univ,
                    asal_jurusan: req.body.asal_jurusan,
                    tanggal_mulai: req.body.tanggal_mulai,
                    tanggal_selesai: req.body.tanggal_selesai,
                    status_aktif: req.body.status_aktif
                }
                if (req.body.password !== null) {
                    updatedPeserta.password = hash;
                }
                
                const isDateOnly = (value) => {
                    // Add your custom validation logic here to check if the value is a date without a time component
                    // For example, you can use a regular expression to match date-only format (YYYY-MM-DD)
                    const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;
                    return dateOnlyRegex.test(value);
                };
                
                const schema = {
                    nama: { type: "string", optional: false, max: 50 },
                    username: { type: "string", optional: true, max: 50 },
                    password: { type: "string", optional: true},
                    asal_univ: { type: "string", optional: false, max: 50 },
                    asal_jurusan: { type: "string", optional: false, max: 50 },
                    tanggal_mulai: { type: "custom", messages: { custom: "Invalid date format" }, check: isDateOnly },
                    tanggal_selesai: { type: "custom", messages: { custom: "Invalid date format" }, check: isDateOnly },
                    status_aktif: { type: "boolean" } // Validate as a boolean
                };
                const v = new Validator();
                const validationResponse = v.validate(updatedPeserta, schema);
                console.log("cek3");

                if(validationResponse !== true){
                    return res.status(400).json({
                        message: "Validation false",
                        errors: validationResponse
                    });
                }
                console.log("cek2");
                await models.Peserta_Magang.update(updatedPeserta, {where:{id:id}});
                console.log("cek");
                await editPresensiForPeserta(updatedPeserta,id, req, res)
            } catch (error){
                res.status(500).json({
                    message: "Something went wrong12",
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

async function showPresensiPerDay(req, res) {
    const response = await axios.get('http://worldtimeapi.org/api/timezone/Asia/Jakarta');
    const tanggal = moment.tz(response.data.datetime, 'Asia/Jakarta');

    try {
        const presensi = await models.Peserta_Magang.findAll({
            include: [{
                model: models.Presensi,
                as: 'presensimagang',
                where: {
                    tanggal: tanggal.format('YYYY-MM-DD')
                }
            }]
        });

        // Menghitung jumlah presensi yang memiliki check_in atau check_out tidak null
        const totalSudahPresensi = presensi.reduce(
            (total, peserta) =>
                total + peserta.presensimagang.filter(p => p.check_in !== null || p.check_out !== null).length,
            0
        );

        res.status(200).json({
            presensi: presensi,
            totalSudahPresensi: totalSudahPresensi
        });
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong',
            error: error
        });
    }
}


async function showPresensiBelum(req, res) {
  try {
    const response = await axios.get('http://worldtimeapi.org/api/timezone/Asia/Jakarta');
    const tanggal = moment.tz(response.data.datetime, "Asia/Jakarta");
    
    const presensi = await models.Peserta_Magang.findAll({
      include: [{
        model: models.Presensi,
        as: 'presensimagang',
        where: {
          tanggal: tanggal.format('YYYY-MM-DD'),
          [Op.or]: [
            { check_in: null },
            { check_out: null },
          ],
        },
      }],
    });

    res.status(200).json({
      presensi: presensi,
    });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({
      message: 'Something went wrong',
      error: error,
    });
  }
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
    statusCheck(req, res);

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
    statusCheck(req, res);
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
    models.Peserta_Magang.findAll({
        where: {
            status_aktif:true
        },
        include:[{
            model:models.Status_tugas,
            where:{
                t_id:tid
            }
        }]
    }).then(result =>{
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



async function addTugas(req, res, url) {
    try {
        statusCheck(req, res);
        const baseUrl = 'http://localhost:3000/'
        const fileName = url.replace('\\' , '/');
        const tugas = {
            judul: req.body.judul,
            tugas_url: baseUrl + fileName,
            dueDate: req.body.dueDate
        }
        const schema = {
            judul: {type:"string", optional:false, max:50},
            tugas_url: {type:"string", optional:false},
            
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

async function statusCheck(req, res){
    try {
        const currentDate = moment(); // Get the current date and time
        // Find all Peserta_Magang entities where tanggal_selesai is earlier than the current date
        const outdatedPeserta = await models.Peserta_Magang.findAll({
          where: {
            tanggal_selesai: {
              [Op.lt]: currentDate,
            },
          },
        });
    
        // Update the status_aktif to false for outdatedPeserta
        await Promise.all(
          outdatedPeserta.map(async (peserta) => {
            await peserta.update({ status_aktif: false });
          })
        );
        console.log('Status of outdated Peserta_Magang entities updated successfully');
      } catch (error) {
        console.error('Error updating status of outdated Peserta_Magang entities:', error);
      }
}

async function exportAdmin(req, res) {
    try {
      const results = await models.Admin.findAll();
  
      const workbook = new exceljs.Workbook();
      const sheet = workbook.addWorksheet('Admins');
      sheet.columns = [
        { header: 'ID', key: 'id', width: 3 },
        { header: 'Nama', key: 'nama', width: 30 },
        { header: 'Username', key: 'username', width: 20 },
        { header: 'Password', key: 'password', width: 80 },
      ];
  
      results.forEach((value) => {
        sheet.addRow({
          id: value.id,
          nama: value.nama,
          username: value.username,
          password: value.password,
        });
      });
  
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
  
      res.setHeader(
        'Content-Disposition',
        'attachment;filename=Admins.xlsx'
      );
  
      const buffer = await workbook.xlsx.writeBuffer();
      res.end(buffer);
  
    } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).json({
        message: 'Something went wrong',
        error: error,
      });
    }
}

async function exportPeserta(req, res) {
    try {
      const results = await models.Peserta_Magang.findAll();
  
      const workbook = new exceljs.Workbook();
      const sheet = workbook.addWorksheet('Peserta Magangs');
      sheet.columns = [
        { header: 'ID', key: 'id', width: 3 },
        { header: 'Nama', key: 'nama', width: 30 },
        { header: 'Username', key: 'username', width: 30 },
        { header: 'Password', key: 'password', width: 80 },
        { header: 'Asal Universitas', key: 'asal_univ', width: 80 },
        { header: 'Asal Jurusan', key: 'asal_jurusan', width: 80 },
        { header: 'Tanggal Mulai', key: 'tanggal_mulai', width: 80 },
        { header: 'Tanggal Selesai', key: 'tanggal_selesai', width: 80 },
        { header: 'Status Aktif', key: 'status_aktif', width: 80 }
      ];
  
      results.forEach((value) => {
        sheet.addRow({
          id: value.id,
          nama: value.nama,
          username: value.username,
          password: value.password,
          asal_univ: value.asal_univ,
          asal_jurusan: value.asal_jurusan,
          tanggal_mulai: value.tanggal_mulai,
          tanggal_selesai: value.tanggal_selesai,
          status_aktif: value.status_aktif
        });
      });
  
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
  
      res.setHeader(
        'Content-Disposition',
        'attachment;filename=PesertaMagangs.xlsx'
      );
  
      const buffer = await workbook.xlsx.writeBuffer();
      res.end(buffer);
  
    } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).json({
        message: 'Something went wrong',
        error: error,
      });
    }
  }

  async function exportStatusTugas(req, res) {
    try {
      const tid = req.params.id;
      const results = await models.Peserta_Magang.findAll({
        include:[{
            model:models.Status_tugas,
            where:{
                t_id:tid
            }
        }]
      });
  
      const workbook = new exceljs.Workbook();
      const sheet = workbook.addWorksheet('Status Tugas');
      sheet.columns = [
        { header: 'Nama', key: 'nama', width: 30 },
        { header: 'Asal Universitas', key: 'asal_univ', width: 80 },
        { header: 'Status Pengerjaan', key: 'status_pengerjaan', width: 30 }
      ];
  
      results.forEach((value) => {
        console.log('Data:', value);
        const statusPengerjaan = value.Status_tugas[0].status_pengerjaan ? 'Sudah Mengerjakan' : 'Belum Mengerjakan';
        
        sheet.addRow({
          nama: value.nama,
          asal_univ: value.asal_univ,
          status_pengerjaan: statusPengerjaan
        });
      });
  
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
  
      res.setHeader(
        'Content-Disposition',
        'attachment;filename=StatusTugas.xlsx'
      );
  
      const buffer = await workbook.xlsx.writeBuffer();
      res.end(buffer);
  
    } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).json({
        message: 'Something went wrong',
        error: error,
      });
    }
  }

  async function exportPresensiPeserta(req, res) {
    try {
      const response = await axios.get('http://worldtimeapi.org/api/timezone/Asia/Jakarta');
      const tanggal = moment.tz(response.data.datetime, "Asia/Jakarta");
      const results = await models.Peserta_Magang.findAll({
        include:[{
            model: models.Presensi,
            as:'presensimagang',
            where: {
                tanggal:tanggal.format('YYYY-MM-DD')
            }
        }]
      });
  
      const workbook = new exceljs.Workbook();
      const sheet = workbook.addWorksheet('Presensi');
      sheet.columns = [
        { header: 'ID', key: 'id', width: 3 },
        { header: 'Nama', key: 'nama', width: 30 },
        { header: 'Asal Universitas', key: 'asal_univ', width: 80 },
        { header: 'Asal Jurusan', key: 'asal_jurusan', width: 80 },
        { header: 'Tanggal Mulai', key: 'tanggal_mulai', width: 80 },
        { header: 'Tanggal Selesai', key: 'tanggal_selesai', width: 80 },
        { header: 'Status Aktif', key: 'status_aktif', width: 80 },
        { header: 'Tanggal', key: 'tanggal', width: 80 },
        { header: 'Check-In', key: 'check_in', width: 80 },
        { header: 'Check-Out', key: 'check_out', width: 80 }

      ];
  
      results.forEach((value) => {
        const tanggalPresensi = value.presensimagang[0].tanggal;
        const checkInPresensi = value.presensimagang[0].check_in;
        const checkOutPresensi = value.presensimagang[0].check_out;
        sheet.addRow({
          id: value.id,
          nama: value.nama,
          asal_univ: value.asal_univ,
          asal_jurusan: value.asal_jurusan,
          tanggal_mulai: value.tanggal_mulai,
          tanggal_selesai: value.tanggal_selesai,
          status_aktif: value.status_aktif,
          tanggal: tanggalPresensi,
          check_in: checkInPresensi,
          check_out: checkOutPresensi
        });
      });
  
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
  
      res.setHeader(
        'Content-Disposition',
        'attachment;filename=Presensi.xlsx'
      );
  
      const buffer = await workbook.xlsx.writeBuffer();
      res.end(buffer);
  
    } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).json({
        message: 'Something went wrong',
        error: error,
      });
    }
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
    editAdmin:editAdmin,
    exportAdmin: exportAdmin,
    exportPeserta: exportPeserta,
    exportStatusTugas: exportStatusTugas,
    exportPresensiPeserta: exportPresensiPeserta
}