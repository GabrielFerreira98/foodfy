const User = require('../models/user')
const crypto = require('crypto')
const mailer = require('../../lib/mailer')
const { hash } = require('bcryptjs')

const LoadRecipe = require('../services/LoadRecipe')

module.exports = {
    async index(req, res){

        const { user } = req

        return res.render('profile-controller/index', {user})
    },

    async put(req, res){
        try{
            const { user } = req
            
            let { name, email, is_admin} = req.body

            await User.update(user.id, {
                name,
                email,
                is_admin
            })

            return res.render('profile-controller/index', {
                user: req.body,
                sucess: 'Conta atualizada com sucesso!'
            })
        }catch(err){
            console.error(err)
            return res.render('profile-controller/index', {
                error: 'Algum erro aconteceu!'
            })
        }
    },
    async recipes(req, res){
        const userId = req.session.userId

        const allUserRecipes = await LoadRecipe.load('recipes', {where: {user_id: userId}})

        const recipes = allUserRecipes

        return res.render('admin/recipes', {recipes})
        
    },
    logout(req, res){
        req.session.destroy()
        res.redirect("/")
    },
    loginForm(req, res){
        return res.render('session/index')
    },
    login(req, res){
        req.session.userId = req.user.id
        req.session.is_admin = req.user.is_admin

        res.redirect('/users/profile')
    },

    forgotForm(req, res){
        return res.render('session/forgot-password')
    },

    async forgot(req, res){
        const user = req.user

        try{
            //TOKEN PARA USUÁRIO
            const token = crypto.randomBytes(20).toString("hex")

            //EXPIRAÇÃO DO TOKEN
            let now = new Date()
            now = now.setHours(now.getHours()+1)

            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now
            })

            //ENVIAR EMAIL COM LINK DE RECUPERAÇÃO DE SENHA
            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@launchstore.com.br',
                subject: 'Recuperação de Senha',
                html: `<h2>Perdeu a chave?</h2>
                <p>Não se preocupe, clique no link abaixo para recuperar sua senha</p>
                <p>
                    <a href="http://localhost:3000/users/password-reset?token=${token}" target="_blank">
                        Recuperar Senha
                    </a>
                </p>
                `,
            })

            //AVISAR USUÁRIO QUE ENVIOU O EMAIL
            return res.render('session/forgot-password',{
                sucess: "Verifique seu email para resetar sua senha!"
            })
        }catch(err){
            console.error(err)
            return res.render('session/forgot-password', {
                error:'Erro inesperado, tente novamente.'
            })
        }
    },

    resetForm(req, res){
        return res.render('session/password-reset', { token: req.query.token    })
    },

    async reset(req, res){

        const  user  = req.user
        const {password, token} = req.body

        try{
            //CRIAR NOVO HASH DE SENHA
            const newPassword = await hash(password, 8)

            //ATUALIZAR USUÁRIO
            await User.update(user.id, {
                password: newPassword,
                reset_token: "",
                reset_token_expires:"",
            })

            //AVISAR AO USUÁRIO QUE ELE POSSUI NOVA SENHA
            return res.render('session/index', {
                user: req.body,
                sucess: 'Senha atualizada! Faça seu login.'
            })


            
        }catch(err){
            console.error(err)
            return res.render('profile-controller/index', {
                user: req.body,
                token,
                error:'Erro inesperado, tente novamente.'
            })
        }
    }
    
}