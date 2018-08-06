//引入express模块
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes')
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const config = require('./config');
const bodyParser = require('body-parser');

//连接数据库
mongoose.connect(config.mongodb);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('数据库已连接');
});


//创建app对象
const app = express()

app.use(function(req, res, next) { 
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// urlencoded: 设置编码方式
// 返回的是一个对象，当extended为false的时候，键值对中的值就为'String'或'Array'类型，为true的时候，则可为任何数据类型
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 设置模板目录
//app.set('views', path.join(__dirname, 'views'))
// 设置模板引擎为 ejs
//app.set('view engine', 'ejs')

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'static')))

// app.use('/',(req,res) => {
//   res.send('shadow-api')
// })

app.use(session({
  name: config.session.key, // 设置 cookie 中保存 session id 的字段名称
  secret: config.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
  resave: true, // 强制更新 session
  saveUninitialized: false, // 设置为 false，强制创建一个 session，即使用户未登录
  cookie: {
    maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
  },
  store: new MongoStore({// 将 session 存储到 mongodb
    url: config.mongodb// mongodb 地址
  })
}))

//路由
routes(app)

//定义服务启动端口
app.listen(config.port, () => {
  console.log(`app listening on port ${config.port}.`)
})