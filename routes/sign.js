const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Schema = require('../model');
const bodyParser = require('body-parser');


router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const Users = mongoose.model('Users', Schema.UserSchema);

// 用户注册，向数据库中添加用户数据
router.post('/register', function (req, res) {
    const newUser = new Users({ // 用户传参
        name: req.body.name,
        password: req.body.password,
    });
    const name = req.body.name;
    Users.find({ name: name }, (err, docs) => {
        if (docs.length > 0) {
            res.send({ isSuccess: false, message: '用户名已存在' })
        } else { // 向logins集合中保存数据
            newUser.save(err => {
                const datas = err ? { isSuccess: false } : { isSuccess: true, message: '注册成功' }
                res.send(datas);
            });
        }
    })
});


module.exports = router