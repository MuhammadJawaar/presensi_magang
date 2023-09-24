const express = require('express');
const userController = require('../controllers/user.controller')

const router = express.Router();

router.get("/tugas/list", userController.showTugasList);
router.get("/tugas/:id", userController.showTugas);
router.get("/tugas/:id", userController.showTugasStatus);

module.exports = router;