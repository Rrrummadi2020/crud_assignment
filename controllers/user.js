const User = require('./../models/user');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { promisify } = require('util');
const { use } = require('../routes/user');
const { sendMail } = require('../utils/email');

exports.signUp = async (req, res) => {
  const newUser = await User.create(req.body);
  let token = signToken(newUser._id);
  return res.status(201).json({ token, message: 'SignUp & logIn Done Successfully ' });
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.status(200).json({ users });
};

exports.login = async (req, res) => {
  /**
   * 1 email & password defined + present in the DB
   * 2 take the user password compare it with db password
   * 3 same then generate token
   * 4
   */
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(404).json({ message: 'Email and password are mandatory to login' });
  }
  const user = await User.findOne({ email }).select('+password');
  if (user && (await user.comparePassword(password, user.password))) {
    let token = signToken(user._id);
    // console.log(user);
    res.status(201).json({ token });
  } else {
    res.status(404).json({ token: 'Wrong' });
  }
};
exports.authController = async (req, res, next) => {
  try {
    console.log('AuthController called');
    /**
     * 1 take the token fromthe req
     * 2 verify the token
     * 3 use is present or not
     * 4 is token expired
     * 4 if password changed or not
     * 5 call next method
     */
    const token = req.headers['authorization'].split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    let jwtVerifiedResult = await promisify(jwt.verify)(token, process.env.SECRET_KEY);
    const user = await User.findOne({ _id: jwtVerifiedResult.id });
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (user.isPasswordExpired(jwtVerifiedResult.iat)) {
      return res.status(401).json({ message: 'Token expired ' });
    }
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
exports.changePasswod = async (req, res) => {
  /**
   * 1 find the user by email ID
   * 2 call the check Password method on the user model
   * 3 add the properties of pw and cpw
   * 4 update the user
   */
  let user = await User.findOne({ email: req.body.email }).select('+password');
  if (user && (await user.comparePassword(req.body.password, user.password))) {
    user.password = req.body.newPassword;
    user.confirmPassword = req.body.confirmNewPassword;
    await await user.save();
    return res.status(200).json({ message: 'Password successfully changed' });
  }
  return res.status(200).json({ message: 'give the correct old username and password' });
};
exports.forgotPasswod = async (req, res, next) => {
  /**
   * 1 find the user with this email
   * 2 if user , create token, encrypt the token, save encrypt tooken & ecpiration time
   * 3 send email with random token generated not the encrypted one
   */
  if (!req.body.email) {
    return res.status(404).json({
      message: 'email ID is required to Reset the password',
      status: 'failure'
    });
  }
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({
      message: 'User not found with this email  ID , please provide valid email ID',
      status: 'failure'
    });
  }
  let resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  let text = `send a PATCH Req to with token ${resetToken}`;
  await sendMail({ email: 'ramarangeswarareddy123@gmail.com', text, subject: 'token will expire on' });
  return res.status(200).json({
    message: 'Reset token sent to your Registered Email ID',
    status: 'success'
  });
};
exports.resetPassword = async (req, res, next) => {
  console.log(req.params.token);
  /**
   * 1 find the user using resetToken
   * 2 update the password & cpw, save ,
   */
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  console.log(hashedToken);
  const user = await User.findOne({ passwordResetToken: hashedToken });
  if (!user)
    return res.status(404).json({
      message: 'Token expired'
    });
  console.log('User _id');
  console.log(user._id);
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();
  return res.status(200).json({
    message: 'Success Reseted the password'
  });
};
const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES
  });
};
