const express = require('express');
const accountController = require('../controllers/account.controller')

const router = express.Router();

router.post("/login", accountController.login);
router.post("/token", accountController.refreshToken);
router.delete("/logout", accountController.logout);
module.exports = router;