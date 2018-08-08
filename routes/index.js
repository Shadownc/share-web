module.exports = function (app) {
    // app.get('/', function (req, res) {
    //     res.redirect('/posts')//路由重定向
    // })

    app.use('/user', require('./sign'))
    app.use('/user/list', require('./lists'))

    // 404 page
    app.use(function (req, res) {
        if (!res.headersSent) {
            //res.status(404).render('404')
            res.send('shadow-api')
        }
    })
}