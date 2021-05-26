const { randomBytes } = require('crypto')
const { hash } = require('bcryptjs')
const mailer = require('../../lib/mailer')

const User = require('../models/user')
const Recipe = require('../models/recipes')
const File = require('../models/file')

const fs = require('fs')

module.exports = {
    create(req, res){
        return res.render('user/create')
    },
    async post(req, res){
        try {
            const password = randomBytes(8).toString("hex")
            req.body.password = await hash(password, 8)

            const userId = await User.create({...req.body})

            await mailer.sendMail({
                from: 'no-reply@foodfy.com',
                to: req.body.email,
                subject: 'Senha usuario Foodfy',
                html: `${password}`
            })

            req.session.userId = userId
        
            return res.render('profile-controller/index', {
                user: req.body,
                sucess: 'Conta criada com sucesso! Veja seu email para obter a senha.'
            })
        } catch (error) {
           console.error(error); 
        }
        
    },

    async list(req, res){
        try {
            let users = await User.findAll()

            return res.render('user/users', { users })
        } catch (error) {
            console.error(error);
        }
        
    },

    async edit(req, res){

        try {
            let user = await User.findOne({where: {id: req.params.id}})

            if (!user) return res.send('User Not Found!')

            return res.render('user/user', { user })
        } catch (error) {
            console.error(error);
        }
    },

    async put(req, res){
        try{
            const { user } = req
            
            let { id, name, email, is_admin} = req.body

            await User.update(id, {
                name,
                email,
                is_admin
            })

            return res.render('user/user', {
                user: req.body,
                sucess: 'Conta atualizada com sucesso!'
            })
        }catch(err){
            console.error(err)
            return res.render('user/user', {
                error: 'Algum erro aconteceu!'
            })
        }
    },

    async delete(req, res){
        try{

            //PEGAR TODAS AS RECEITAS DESSE USUÁRIO
            const recipes = await Recipe.findAll({where: {user_id: req.body.id }})

            //PEGAR TODAS AS IMAGENS DAS RECEITAS
            const allFilesPromise = recipes.map(recipe => 
                Recipe.files(recipe.id))

            let promiseResults = await Promise.all(allFilesPromise)

            //REMOVER USUÁRIO
            await User.delete(req.body.id)
            req.session.destroy()

            //REMOVER DO BANCO DE DADOS
            //REMOVER DA PASTA PUBLIC
            promiseResults.map(files => {
                files.map(async file => {
                    try{
                        await File.delete(file.id)
                        fs.unlinkSync(file.path)
                    }catch(err){
                        console.error(err)
                    }
                })
            })

            return res.render("session/index", {
                sucess: 'Conta deletada com sucesso!'
            })

        }catch(err){
            console.error(err)
            return res.render("user/users", {
                error: "Algum erro aconteceu!"
            })
        }
    }


}