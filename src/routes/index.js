const express = require('express')
const routes = express.Router()

const index = require('../app/controllers/index')

const admin = require('./admin')
const users = require('./users')

//INDEX

routes.get('/', index.index)
routes.get('/about', index.about)
routes.get('/recipes', index.recipes)
routes.get('/recipe/:id', index.showRecipe)
routes.get('/chefs', index.chefs)
routes.get('/chef/:id', index.showChef)

routes.use('/users', users)
routes.use('/admin', admin)

module.exports = routes

