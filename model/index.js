const mongoose = require('mongoose');

//用户注册
exports.UserSchema = new mongoose.Schema({
    name: String,
    password: String,
    avatar: String
})