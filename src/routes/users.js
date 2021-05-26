const express = require('express')
const routes = express.Router()

const ProfileController = require('../app/controllers/profileController')
const UserController = require('../app/controllers/userController')

const UserValidator = require('../app/validators/user')
const ProfileControllerValidator = require('../app/validators/ProfileController')

const { isLoggedRedirectToUsers, isAdmin, onlyUsers } = require('../app/middlewares/session')

// // Rotas de perfil de um usuário logado
routes.get('/profile', ProfileControllerValidator.index, ProfileController.index) // Mostrar o formulário com dados do usuário logado
routes.put('/profile', ProfileControllerValidator.put, ProfileController.put)// Editar o usuário logado
routes.get('/recipes', ProfileController.recipes)// Mostrar as receitas do usuário logado

// // Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/', onlyUsers ,isAdmin, UserController.list) // Mostrar a lista de usuários cadastrados
routes.post('/create', UserValidator.post, UserController.post) // Cadastrar um usuário
routes.get('/create', isAdmin , UserController.create) // Mostrar o formulário de criação de um usuário
routes.put('/:id', ProfileControllerValidator.put ,UserController.put) // Editar um usuário
routes.get('/:id/edit', isAdmin, UserController.edit) // Mostrar o formulário de edição de um usuário
routes.delete('/', UserController.delete) // Deletar um usuário

// // LOGIN/LOGOUT

routes.get('/login', isLoggedRedirectToUsers ,ProfileController.loginForm)
routes.post('/login', ProfileControllerValidator.login, ProfileController.login)
routes.post('/logout', ProfileController.logout)

// // RESET PASSWORD/FORGOT

routes.get('/forgot-password', ProfileController.forgotForm)
routes.get('/password-reset', ProfileController.resetForm)
routes.post('/forgot-password', ProfileControllerValidator.forgot ,ProfileController.forgot)
routes.post('/password-reset', ProfileControllerValidator.reset ,ProfileController.reset)

module.exports = routes
