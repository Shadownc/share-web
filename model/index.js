const mongoose = require('mongoose');

//用户注册
exports.UserSchema = new mongoose.Schema({
    name: String,
    password: String,
    avatar: String
})

//用户收藏
exports.shareListSchema = new mongoose.Schema({
    userNick: String,
    title: String,
    urlLink: String,
    avatar: String,
    description: String,
    date: { type: Date, default: Date.now },
    isTop: { type: Boolean, default: false },
    type: { type: String, default: '全部' }
})