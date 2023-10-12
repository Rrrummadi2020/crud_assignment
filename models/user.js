const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: [true, 'Please enter your name']
    },
    email: {
        type: String,
        unique: true,
        require: [true, 'Please enter your email']
    },
    password: {
        select: false,
        type: String,
        require: [true, 'Please enter your password']
    },
    confirmPassword: {
        type: String,
        select: false,
        require: [true, 'Please enter your COnfirm password']
    },
    image: {
        type: String
    },
})
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 9);
    next();
});
userSchema.methods.comparePassword = async function (candidatePass, dbPassword) {
    return await bcrypt.compare(candidatePass, dbPassword);
}
const User = mongoose.model('User', userSchema);
module.exports = User;