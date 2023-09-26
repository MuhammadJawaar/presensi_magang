const express = require('express');
const accountController = require('../controllers/account.controller')

const router = express.Router();

router.post("/login", accountController.login);

module.exports = router;