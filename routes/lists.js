const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Schema = require('../model');

const lists = mongoose.model('lists', Schema.shareListSchema);

let id;//分页查询用

//添加收藏链接
router.post('/add', (req, res) => {
    let { urlLink, title } = req.body, userNick = req.session.user.name;
    //console.log(urlLink);
    if (!userNick) {
        res.status(200).json({ code: '01', message: '请登录' });
        return
    }
    if (!title) {
        res.status(200).json({ code: '01', message: '分享标题不能为空' });
        return
    }
    if (!urlLink) {
        res.status(200).json({ code: '01', message: '分享链接不能为空' });
        return
    }
    let params = Object.assign({}, { userNick: userNick }, req.body)
    const newShare = new lists({ // 用户传参
        ...params
    });
    lists.find({ userNick: userNick, urlLink: urlLink }, (err, list) => {
        if (list.length > 0) {
            res.send({ code: '01', message: '该分享已存在' })
        } else { // 向lists集合中保存数据
            newShare.save(err => {
                const datas = err ? { code: '01', message: err } : { code: '00', message: '添加成功' }
                res.send(datas);
            });
        }
    })
});
//删除
router.post('/del', (req, res) => {
    let { id } = req.body, userNick = req.session.user.name;
    if (!userNick) {
        res.status(200).json({ code: '01', message: '暂无权限,请登录或联系管理员' });
        return
    }
    lists.remove({ userNick: userNick, _id: id }, (err, suc) => {
        if (err) {
            console.log(err);
        } else {
            if (suc.n) {
                res.status(200).json({ code: '00', message: '删除成功' });
            } else {
                res.status(200).json({ code: '00', message: '已经删除' });
            }
        }
    })
})
//获取当前用户的列表--分页
router.post('/getData', (req, res) => {
    //console.log(req.body);
    let { page, pageSize } = req.body, userNick = req.session.user.name;
    if (!userNick) {
        res.status(200).json({ code: '01', message: '获取列表失败' });
        return
    }
    if (id && page != 1) {
        lists.find({ userNick: userNick, '_id': { "$lt": id } })//向上查找
            //.skip(Number(page * pageSize))
            .limit(Number(pageSize))
            .sort({ '_id': -1 })
            .exec((err, lists) => {
                if (err) {
                    console.log(err);
                } else {
                    res.status(200).json({ code: '00', lists: [...lists] });
                }
            });
    } else {
        lists.find({ userNick: userNick })
            .limit(Number(pageSize))
            .sort({ '_id': -1 })
            .exec((err, lists) => {
                if (err) {
                    console.log(err);
                } else {
                    if (lists.length == 0) {
                        res.status(200).json({ code: '00', lists: [] });
                    } else {
                        let num = lists.length - 1;
                        id = lists[num].id;
                        res.status(200).json({ code: '00', lists: [...lists] });
                    }
                }
            });
    }
})

module.exports = router