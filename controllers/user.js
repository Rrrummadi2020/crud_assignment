const User = require('./../models/user');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

exports.signUp = async (req, res) => {
    const newUser = await User.create(req.body);
    res.status(201).json({ newUser });
};

exports.getAllUsers = async (req, res) => {
    const users = await User.find();
    res.status(200).json({ users });
}

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
    if (user && await user.comparePassword(password, user.password)) {
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
        const user = await User.findOne({_id:jwtVerifiedResult.id});
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        if(user.isPasswordExpired(jwtVerifiedResult.iat)){
            return res.status(401).json({ message: 'Token expired ' });
        }
        next();

    } catch (e) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}
exports.changePasswod = async (req, res) => {
  /**
   * 1 find the user by email ID
   * 2 call the check Password method on the user model
   * 3 add the properties of pw and cpw
   * 4 update the user
   */
  let user = await User.findOne({ email: req.body.email }).select("+password");
  if (user && (await user.comparePassword(req.body.password, user.password))) {
    user.password = req.body.newPassword;
    user.confirmPassword = req.body.confirmNewPassword;
    await await user.save();
    return res.status(200).json({ message: "Password successfully changed" });
  }
  return res
    .status(200)
    .json({ message: "give the correct old username and password" });
};
const signToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES
    })
}