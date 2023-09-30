const express = require('express');
const adminController = require('../controllers/admin.controller');
const checkAuthMiddleware = require('../middleware/check-auth');

const router = express.Router();

router.post("/add-admin", checkAuthMiddleware.checkAuthAdmin, adminController.addAdmin);
router.patch("/edit-admin/:id", checkAuthMiddleware.checkAuthAdmin, adminController.editAdmin);

router.get("/peserta/", checkAuthMiddleware.checkAuthAdmin, adminController.showPesertaAll);
router.get("/peserta/:id",  checkAuthMiddleware.checkAuthAdmin,adminController.showPeserta); 
router.post("/peserta/add", checkAuthMiddleware.checkAuthAdmin, adminController.addPeserta);
router.patch("/peserta/:id/edit", checkAuthMiddleware.checkAuthAdmin, adminController.editPeserta);
router.delete("/peserta/:id/delete", checkAuthMiddleware.checkAuthAdmin, adminController.deletePeserta);

router.get("/presensi/", checkAuthMiddleware.checkAuthAdmin, adminController.showPresensiPerDay);
router.get("/presensi/negatif", checkAuthMiddleware.checkAuthAdmin, adminController.showPresensiBelum);
router.get("/presensi/:id", checkAuthMiddleware.checkAuthAdmin, adminController.showPresensiPerPeserta)

router.get("/tugas", checkAuthMiddleware.checkAuthAdmin, adminController.showTugasAll);
router.post("/tugas/add", checkAuthMiddleware.checkAuthAdmin, adminController.addTugas);
router.get("/tugas/:id", checkAuthMiddleware.checkAuthAdmin, adminController.showTugasStatusByTugas);
router.delete("/tugas/:id/delete", checkAuthMiddleware.checkAuthAdmin, adminController.deleteTugas);

module.exports = router;