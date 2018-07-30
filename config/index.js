module.exports = {
    port: 3000,
    session: {
      secret: 'shadow',
      key: 'shadow',
      maxAge: 2592000000
    },
    mongodb: 'mongodb://localhost:27017/testApi'
  }