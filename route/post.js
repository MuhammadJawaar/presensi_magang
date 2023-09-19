const express = require('express');
const peserta_magangController = require('../cotrollers/post_controller.js')

const router = express.router;

router.post("/", peserta_magangController.save);

module.exports = router;