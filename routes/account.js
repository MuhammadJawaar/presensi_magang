const express = require('express');
const accountController = require('../controllers/account.controller')

const router = express.Router();

router.post("/login", accountController.login);
router.delete("/logout", accountController.logout);
router.post("/token", accountController.refreshToken);
module.exports = router;