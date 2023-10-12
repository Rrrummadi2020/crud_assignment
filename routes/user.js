const express = require('express');
const { getAllUsers, signUp, login, authController } = require('../controllers/user');
const router = express.Router();

router.route('/').get(authController, getAllUsers);
router.route('/signup').post(signUp);
router.route('/login').post(login);

module.exports = router;