const express = require('express');
const adminController = require('../controllers/admin.controller')

const router = express.Router();

router.post("/add-admin", adminController.addAdmin);
router.post("/peserta/add", adminController.addPeserta);

module.exports = router;