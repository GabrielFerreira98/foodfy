const User = require("../models/user")
const { compare } = require('bcryptjs')


async function index(req, res, next){

    const { userId: id } = req.session

        const user = await User.findOne({where: {id} })

        if (!user) return res.render('user/create', {
            error: 'Usuário não encontrado.'
        })

        req.user = user

    next()
}

async function put(req, res, next){

    const keys = Object.keys(req.body)
    
        for (key of keys){
            if(req.body[key] == ''){
                return res.render('user/create', {
                    user: req.body,
                    error: 'Por favor, preencha todos os campos!'
                })
            }
        }

        const { id } = req.body
        user = await User.findOne({
            where: {id}
        })

        let isAdmin = false
        if(req.body.is_admin) isAdmin = true

        req.body.is_admin = isAdmin
        req.user = user

    next()
}

async function login(req, res, next){
    const { email, password } = req.body

    const user = await User.findOne({where: {email} })

    if (!user) return res.render("session/index", {
        user: req.body,
        error: 'Usuário não cadastrado'
    })

    const passed = await compare(password, user.password)
    
        if(!passed) return res.render("session/index", {
            user: req.body,
            error: "Senha incorreta."
        })

    req.user = user

    next()
}

async function forgot(req, res, next){
    const { email } = req.body

    try{

        let user = await User.findOne({ where : {email} })

        if (!user) return res.render("session/forgot-password", {
            user: req.body,
            error: 'Email não cadastrado'
        })

        req.user = user

        next()


    }catch(err){
        console.error(err)
    }
}

async function reset(req, res, next){
    //PROCURAR USUÁRIO
    const { email, password, token, passwordRepeat } = req.body

    const user = await User.findOne({where: {email} })

    if (!user) return res.render("session/password-reset", {
        user: req.body,
        token,
        error: 'Usuário não cadastrado'
    })

    //VER SE A SENHA BATE
    if(password != passwordRepeat)
        return res.render('session/password-reset', {
            user: req.body,
            token,
            error: 'Senhas não estão iguais.'
        })

    //VERIFICAR SE O TOKEN BATE
    if (token != user.reset_token) return res.render('session/password-reset', {
        user: req.body,
        token,
        error: 'Token Inválido. Solicite uma nova recuperação de senha.'
    })

    //VERIFICAR SE O TOKEN NÃO EXPIROU
    let now = new Date()
    now = now.setHours(now.getHours())

    if (now > user.reset_token_expires) return res.render('session/password-reset', {
        user: req.body,
        token,
        error: 'Token expirado. Solicite uma nova recuperação de senha.'
    })

    req.user = user
    next()
}

module.exports = {
    index,
    put,
    login,
    forgot,
    reset
}