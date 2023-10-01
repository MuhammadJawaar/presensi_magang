const models = require('../models');
const moment = require('moment');


function showTugasList(){
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

function showPresensi(req, res){
    const id = req.params.id;
    if (true){
        models.Presensi.findAll({where:{p_id:id}}).then(result =>{
            res.status(200).json({
                tugas:result
            });
    }).catch(error =>{
        res.status(500).json({
            message: "Something went wrong",
            error:error
        });
    });
    }else{
        res.status(403).json({
            message: "bukan id kamu"
        })
    }
}

function doPresensi(req,res){
    const currentDate = new Date();
    const pid = req.params.id
    const hari = moment(currentDate).day();
    const tanggal = moment(currentDate);
    if (hari == 5){
        const jamMulai1 = 7; // Jam mulai rentang waktu pertama
        const menitMulai1 = 15; // Menit mulai rentang waktu pertama
        const jamBerakhir1 = 8; // Jam berakhir rentang waktu pertama
        const menitBerakhir1 = 45; // Menit berakhir rentang waktu pertama

        const jamMulai2 = 13; // Jam mulai rentang waktu kedua
        const menitMulai2 = 45; // Menit mulai rentang waktu kedua
        const jamBerakhir2 = 14; // Jam berakhir rentang waktu kedua
        const menitBerakhir2 = 15; // Menit berakhir rentang waktu kedua

        const currentHour = currentDate.getHours();
        const currentMinute = currentDate.getMinutes();
        const currentSecond = currentDate.getSeconds();

        if (
            (currentHour >= jamMulai1 && currentHour < jamBerakhir1) ||
            (currentHour === jamMulai1 && currentMinute >= menitMulai1) ||
            (currentHour === jamBerakhir1 && currentMinute <= menitBerakhir1)
        ) {
            const presensi = {
                check_in: currentDate,
                image_url_in: req.body.image_url
            }
            models.Presensi.update(presensi, {where:{p_id:pid, tanggal:tanggal.format('YYYY-MM-DD')}}).then(result => {
                res.status(201).json({
                    message: "Presensi successful"
                });
            }).catch(error =>{
                res.status(500).json({
                    message: "Something went wrong",
                    error:error
                });
            });
        } else if (
            (currentHour >= jamMulai2 && currentHour <= jamBerakhir2) ||
            (currentHour === jamMulai2 && currentMinute >= menitMulai2) ||
            (currentHour === jamBerakhir2 && currentMinute <= menitBerakhir2)
        ) {
            const presensi = {
                check_out: currentDate,
                image_url_out: req.body.image_url
            }
            models.Presensi.update(presensi,{where:{p_id:pid, tanggal:tanggal.format('YYYY-MM-DD')}}).then(result => {
                res.status(201).json({
                    message: "Presensi successful"
                });
            }).catch(error =>{
                res.status(500).json({
                    message: "Something went wrong",
                    error:error
                });
            });
        }
        else{
            res.status(500).json({
                message: "Something went wrong",
            });
        }
    }else if (hari != 0 || hari != 6){
        const jamMulai1 = 7; // Jam mulai rentang waktu pertama
        const menitMulai1 = 45; // Menit mulai rentang waktu pertama
        const jamBerakhir1 = 8; // Jam berakhir rentang waktu pertama
        const menitBerakhir1 = 15; // Menit berakhir rentang waktu pertama

        const jamMulai2 = 15; // Jam mulai rentang waktu kedua
        const menitMulai2 = 45; // Menit mulai rentang waktu kedua
        const jamBerakhir2 = 16; // Jam berakhir rentang waktu kedua
        const menitBerakhir2 = 15; // Menit berakhir rentang waktu kedua

        const currentHour = currentDate.getHours();
        const currentMinute = currentDate.getMinutes();
        const currentSecond = currentDate.getSeconds();

        if (
            (currentHour >= jamMulai1 && currentHour < jamBerakhir1) ||
            (currentHour === jamMulai1 && currentMinute >= menitMulai1) ||
            (currentHour === jamBerakhir1 && currentMinute <= menitBerakhir1)
        ) {
            
            const presensi = {
                check_in: currentDate,
                image_url_in: req.body.image_url
            }
            models.Presensi.update(presensi, {where:{p_id:pid, tanggal:tanggal.format('YYYY-MM-DD')}}).then(result => {
                res.status(201).json({
                    message: "Presensi successful",
                    result:result
                });
            }).catch(error =>{
                res.status(500).json({
                    message: "Something went wrong",
                    error:error
                });
            });
        } else if (
            (currentHour >= jamMulai2 && currentHour <= jamBerakhir2) ||
            (currentHour === jamMulai2 && currentMinute >= menitMulai2) ||
            (currentHour === jamBerakhir2 && currentMinute <= menitBerakhir2)
        ) {
            
            const presensi = {
                check_out: currentDate,
                image_url_out: req.body.image_url
            }
            models.Presensi.update(presensi,{where:{p_id:pid, tanggal:tanggal.format('YYYY-MM-DD')}}).then(result => {
                console.log("cek masuk dong");
                res.status(201).json({
                    message: "Presensi successful",
                    result:result
                });
            }).catch(error =>{
                res.status(500).json({
                    message: "Something went wrong",
                    error:error
                });
            });
        }else{
            res.status(500).json({
                message: "Something went wrong",
            });
        }
    }else{
        res.status(500).json({
            message: "Something went wrong",
        });
    }
}


function doTugas(req, res){
    const pid = req.body.pid; //ini perlu diganti biar otomatis
    const tid = req.params.tid;
    const tugas = {
        tugas_url: req.body.tugas_url,
        status_pengerjaan: true
    }
    models.Status_tugas.update(tugas, {where:{p_id:pid, t_id: tid}}).then(result => {
        res.status(201).json({
            message: "Tugas Uploaded successfully"
        });
    }).catch(error =>{
        res.status(500).json({
            message: "Something went wrong",
            error:error
        });
    });
}

function editPassword(){
    bcryptjs.genSalt(10,async function(err,salt){
        bcryptjs.hash(req.body.password,salt,async function(err,hash){
            try {
                const id = req.params.id;
                const updatedPeserta = {
                    password: hash                
                }
                const schema = {
                    password: {type:"string", optional:false},
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

module.exports = {
    showTugasList:showTugasList,
    showTugas:showTugas,
    showPresensi:showPresensi,
    doPresensi:doPresensi,
    doTugas:doTugas,
    editPassword:editPassword
}