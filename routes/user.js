const express = require('express');
const { getAllUsers, signUp, login, authController, changePasswod, forgotPasswod } = require('../controllers/user');
const router = express.Router();

router.route('/').get(authController, getAllUsers);
router.route('/signup').post(signUp);
router.route('/login').post(login);
router.route('/changePassword').post(changePasswod);
router.route('/forgotPassword').patch(forgotPasswod);

module.exports = router;
