const express = require('express')
const nunjucks = require('nunjucks')
const routes = require('./routes')
const methodOverride = require('method-override')
const session = require('./config/session')

const server = express()

server.use((req, res, next) => {
    res.locals.session = req.session
    next()
})

server.use(session)

server.set("view engine", "njk")

server.use(express.urlencoded({ extended: true }))
server.use(express.static('public')) //Traz os arquivos da pasta public para o servidor criado
server.use(methodOverride('_method'))
server.use(routes)

nunjucks.configure("src/app/views",{
    express:server,
    autoescape: false,
    noCache:false
})

server.listen(4000, function(){
    console.log("Server is running");    
})




