const express = require('express');
const authController = require('../contollers/auth');
const router = express.Router();

router.post('/register', authController.register);

module.exports = router;