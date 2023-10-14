const express = require('express');
const { getAllUsers, signUp, login, authController, changePasswod } = require('../controllers/user');
const router = express.Router();

router.route('/').get(authController, getAllUsers);
router.route('/signup').post(signUp);
router.route('/login').post(login);
router.route('/changePassword').post(changePasswod);

module.exports = router;