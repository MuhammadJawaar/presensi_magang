const models = require('../models')
const peserta_magang = require('../models/peserta_magang')

function save (req,res){
    const Peserta_Magang = {
        nama: req.body.nama,
        asal_univ: req.body.asal_univ,
        asal_jurusan:req.body.asal_jurusan,
        tanggal_mulai: req.body.tanggal_mulai,
        status_aktif: req.body.status_aktif,
        username: req.body.username,
        password: req.body.password,
        p_id : 1

    }
    models.Peserta_Magang.create(peserta_magang).then(result =>{
        res.status(201).json({
            message: 'post created succsesfully',
            Peserta_Magang:result
        });
    }).catch(error => {
        res.status(500).json({
            message: 'post fail',
            error:error
        });
    })
    
}



module.exports = {
    index:index
}