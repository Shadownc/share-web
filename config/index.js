module.exports = {
  port: 3000,
  session: {
    secret: 'shadow',
    key: 'shadow',
    maxAge: 2592000000
  },
  //mongodb: 'mongodb://localhost:27017/testApi'
  mongodb: process.env.NODE_ENV !== 'development' ? 'mongodb://bdy.junn.top:27017/testApi' : 'mongodb://localhost:27017/testApi'//区分本地开发和线上环境
}