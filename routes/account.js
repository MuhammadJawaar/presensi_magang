const express = require('express');
const peserta_magangController = require('../controllers/account.controller')

const router = express.router;

router.post("/login", peserta_magangController.save);

module.exports = router;