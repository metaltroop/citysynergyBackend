// backend/routes/authRoutes.js
const express = require('express');
const { register, login, forgotPassword } = require('../controller/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

module.exports = router;
