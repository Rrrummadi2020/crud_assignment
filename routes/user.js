const express = require('express');
const {
  getAllUsers,
  signUp,
  login,
  authController,
  changePasswod,
  forgotPasswod,
  resetToken,
  resetPassword,
  restrictTo
} = require('../controllers/user');
const router = express.Router();

router.route('/').get(authController, restrictTo('admin'), getAllUsers);
router.route('/signup').post(signUp);
router.route('/login').post(login);
router.route('/changePassword').post(changePasswod);
router.route('/forgotPassword').patch(forgotPasswod);
router.route('/resetPassword/:token').patch(resetPassword);

module.exports = router;
