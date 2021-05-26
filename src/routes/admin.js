const express = require('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')

const recipes = require('../app/controllers/recipes')
const chefs = require('../app/controllers/chefs')

const { onlyUsers, isAdmin, recipeOwner } = require('../app/middlewares/session')
const Validator = require('../app/validators/recipe-chef')

//ADMIN

routes.get('/recipes', onlyUsers, recipes.index)
routes.get('/recipe/:id', onlyUsers, recipes.show)
routes.get('/recipes/create', onlyUsers, recipes.create)
routes.get('/recipes/:id/edit', recipeOwner, recipes.edit)

routes.get('/chefs', onlyUsers, chefs.index)
routes.get('/chef/:id', onlyUsers, chefs.show)
routes.get('/createChef', onlyUsers, isAdmin, chefs.create)
routes.get('/editChef/:id', onlyUsers, isAdmin, chefs.edit)

routes.post('/recipes', multer.array("photos", 5), Validator.post, recipes.post)
routes.put('/recipes', multer.array("photos", 5) , Validator.put, recipes.put)
routes.delete('/recipes', recipes.delete)

routes.post('/chefs', multer.array("photos", 1), Validator.post, chefs.post)
routes.put('/chefs', multer.array("photos", 1), Validator.put, chefs.put)
routes.delete('/chefs', chefs.delete)

module.exports = routes
