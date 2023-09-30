const express = require('express');
const userController = require('../controllers/user.controller');
const checkAuthMiddleware = require('../middleware/check-auth');

const router = express.Router();

router.get("/tugas/list", checkAuthMiddleware.checkAuthPeserta, userController.showTugasList);
router.get("/tugas/:id", checkAuthMiddleware.checkAuthPeserta, userController.showTugas); //cek token
router.patch("/tugas/:tid/submit", checkAuthMiddleware.checkAuthPeserta, userController.doTugas); //cek token
router.get('/presensi/:id', checkAuthMiddleware.checkAuthPeserta, userController.showPresensi); //cek token
router.patch('/presensi/:id/up', checkAuthMiddleware.checkAuthPeserta, userController.doPresensi); //cek token
router.patch('/peserta/:id/edit', checkAuthMiddleware.checkAuthPeserta, userController.editPassword); //cek token

module.exports = router;