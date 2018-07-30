//引入express模块
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const routes=require('./routes')
const bodyParser = require('body-parser');
const config = require('./config');

//连接数据库
mongoose.connect(config.mongodb);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('数据库已连接');
});


//创建app对象
const app = express()

// 设置模板目录
//app.set('views', path.join(__dirname, 'views'))
// 设置模板引擎为 ejs
//app.set('view engine', 'ejs')

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'static')))

// app.use('/',(req,res) => {
//   res.send('shadow-api')
// })

//路由
routes(app)

//定义服务启动端口
app.listen(config.port, () => {
  console.log(`app listening on port ${config.port}.`)
})