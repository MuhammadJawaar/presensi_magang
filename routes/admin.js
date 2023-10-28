const express = require('express');
const adminController = require('../controllers/admin.controller');
const checkAuthMiddleware = require('../middleware/check-auth');
const imageUploader = require('../helpers/image-uploader')

const router = express.Router();

router.get("/show-admin-id/:id", checkAuthMiddleware.checkAuth('admin'), adminController.showAdminById);
router.get("/show-admin", checkAuthMiddleware.checkAuth('admin'), adminController.showAdmin);
router.post("/add-admin", checkAuthMiddleware.checkAuth('admin'), adminController.addAdmin);
router.patch("/edit-admin/:id", checkAuthMiddleware.checkAuth('admin'), adminController.editAdmin);
router.get("/export-admin", checkAuthMiddleware.checkAuth('admin'), adminController.exportAdmin);

router.get("/peserta",checkAuthMiddleware.checkAuth('admin'),  adminController.showPesertaAll);
router.get("/peserta/:id",  checkAuthMiddleware.checkAuth('admin'),adminController.showPeserta); 
router.post("/peserta/add", checkAuthMiddleware.checkAuth('admin'), adminController.addPeserta);
router.patch("/peserta/:id/edit", checkAuthMiddleware.checkAuth('admin'), adminController.editPeserta);
router.delete("/peserta/:id/delete", checkAuthMiddleware.checkAuth('admin'), adminController.deletePeserta);
router.get("/export-peserta",checkAuthMiddleware.checkAuth('admin'), adminController.exportPeserta);

router.get("/presensi", checkAuthMiddleware.checkAuth('admin'), adminController.showPresensiPerDay);
router.get("/presensi/negatif", checkAuthMiddleware.checkAuth('admin'), adminController.showPresensiBelum);
router.get("/presensi/:id", checkAuthMiddleware.checkAuth('admin'), adminController.showPresensiPerPeserta);
router.get("/export-presensi",checkAuthMiddleware.checkAuth('admin'),  adminController.exportPresensiPeserta);


router.get("/tugas", checkAuthMiddleware.checkAuth('admin'), adminController.showTugasAll);
router.post("/tugas/add", checkAuthMiddleware.checkAuth('admin'), adminController.addTugas);
router.get("/tugas/:id", checkAuthMiddleware.checkAuth('admin'), adminController.showTugasStatusByTugas);
router.delete("/tugas/:id/delete", checkAuthMiddleware.checkAuth('admin'), adminController.deleteTugas);
router.get("/tugas/:id/export-tugas", checkAuthMiddleware.checkAuth('admin'), adminController.exportStatusTugas);

module.exports = router;