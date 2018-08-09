const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Schema = require('../model');
//const crypto = require('crypto');//密码加密
//const md5 = crypto.createHash('md5');
//const bodyParser = require('body-parser');
const multer = require('multer'),
    upload = multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'static/images')//文件存放目录
            },
            filename: function (req, file, cb) {
                let arr = file.originalname.split('.');
                cb(null, `${arr[0]}-${Date.now()}.${arr[file.originalname.split('.').length - 1]}`)//原文件名+时间戳
            }
        })
    });
// upload = multer({ dest: 'static/images' });


//router.use(bodyParser.urlencoded({ extended: true }));
//router.use(bodyParser.json());

const Users = mongoose.model('Users', Schema.UserSchema);

// 用户注册，向数据库中添加用户数据
router.post('/register', (req, res) => {
    if (JSON.stringify(req.body) == '{}') {
        res.status(200).json({ code: '01', message: '参数错误' });
        return
    }
    const newUser = new Users({ // 用户传参
        name: req.body.name,
        password: require('crypto').createHash('md5').update(req.body.password).digest('hex'),
    });
    const name = req.body.name;
    const password = req.body.password;
    if (!name) {
        res.status(200).json({ code: '01', message: '用户名不能为空' });
        return
    }
    if (!password) {
        res.status(200).json({ code: '01', message: '密码不能为空' });
        return
    }
    Users.find({ name: name }, (err, users) => {
        if (users.length > 0) {
            res.send({ code: '01', message: '用户名已存在' })
        } else { // 向Users集合中保存数据
            newUser.save(err => {
                const datas = err ? { code: '01' } : { code: '00', message: '注册成功' }
                res.send(datas);
            });
        }
    })
});
//登录
router.post('/login', (req, res) => {
    let _user = req.body;
    let name = _user.name;
    let password = require('crypto').createHash('md5').update(_user.password).digest('hex');
    if (JSON.stringify(_user) == '{}') {
        res.status(200).json({ code: '01', message: '参数错误' });
        return
    }
    if (!name) {
        res.status(200).json({ code: '01', message: '用户名不能为空' });
        return
    }
    if (!password) {
        res.status(200).json({ code: '01', message: '密码不能为空' });
        return
    }
    Users.findOne({ name: name }, (err, user) => {
        if (err) {
            console.log(err);
        }
        if (!user) {
            res.status(200).json({ code: '01', message: '用户不存在' });
            return
        }
        if (password == user.password) {
            req.session.user = user; // 用户名存入session中
            console.log('登录成功——用户名: ' + user);
            res.status(200).json({ code: '00', message: '登录成功' });
        } else {
            res.status(200).json({ code: '01', message: '密码错误' });
        }
    });
});
//获取登录信息
router.get('/getInfo', (req, res) => {
    if (!req.session.user) {
        res.status(200).json({ code: '01', message: '请登录' });
        return
    }
    let name = req.session.user.name;
    Users.findOne({ name: name }, { password: 0 }, (err, user) => {//排除密码字段
        if (err) {
            console.log(err);
        }
        res.status(200).json({ code: '00', userInfo: user });
    });
});
//退出登录
router.get('/logout', (req, res) => {
    //req.session.user = null;
    //res.clearCookie('shadow');
    req.session.destroy();//销毁session，同时在req.session中被移除，但是在下一次请求的时候又会被创建
    res.status(200).json({ code: '00', message: '退出成功' });
});
//上传图片
router.post('/upload', upload.single('file'), (req, res, next) => {
    //console.log(req.file);
    if (!req.file) {
        res.status(200).json({ code: '01', message: '请选择文件' });
        return
    }
    let port = process.env.NODE_ENV !== 'development' ? '' : `:3000`;
    res.status(200).json({
        code: '00',
        path: `${req.protocol}://${req.hostname}${port}/images/${req.file.filename}`
    });
});

module.exports = router