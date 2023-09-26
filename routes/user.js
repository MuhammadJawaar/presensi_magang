const express = require('express');
const userController = require('../controllers/user.controller')

const router = express.Router();

router.get("/tugas/list", userController.showTugasList);
router.get("/tugas/:id", userController.showTugas);
router.patch("/tugas/:tid/submit", userController.doTugas);
router.get('/presensi/:id', userController.showPresensi);
router.patch('/presensi/:id/up', userController.doPresensi);

module.exports = router;