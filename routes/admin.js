const express = require('express');
const adminController = require('../controllers/admin.controller')

const router = express.Router();

router.post("/add-admin", adminController.addAdmin);

router.get("/peserta/", adminController.showPesertaAll);
router.get("/peserta/:id", adminController.showPeserta);
router.patch("/peserta/:id/edit", adminController.editPeserta);
router.delete("/peserta/:id/delete", adminController.deletePeserta);
router.post("/peserta/add", adminController.addPeserta);

router.get("/presensi", adminController.showPresensiAll);

router.get("/tugas", adminController.showTugasStatus);
router.get("/tugas/list", adminController.showTugasAll);
router.post("/tugas/add", adminController.addTugas);
router.get("/tugas/:id", adminController.showTugas);
router.delete("/tugas/:id/delete", adminController.deleteTugas);

module.exports = router;