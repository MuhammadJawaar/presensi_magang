const express = require('express');
const adminController = require('../controllers/admin.controller')

const router = express.Router();

router.post("/add-admin", adminController.addAdmin);

router.get("/peserta/", adminController.showPesertaAll);
router.get("/peserta/:id", adminController.showPeserta);
router.post("/peserta/add", adminController.addPeserta);
router.patch("/peserta/:id/edit", adminController.editPeserta);
router.delete("/peserta/:id/delete", adminController.deletePeserta);

router.get("/presensi/", adminController.showPresensiPerDay);
router.get("/presensi/negatif", adminController.showPresensiBelum);
router.get("/presensi/:id", adminController.showPresensiPerPeserta)

router.get("/tugas", adminController.showTugasAll);
router.post("/tugas/add", adminController.addTugas);
router.get("/tugas/:id", adminController.showTugasStatusByTugas);
router.delete("/tugas/:id/delete", adminController.deleteTugas);

module.exports = router;