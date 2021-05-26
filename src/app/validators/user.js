const User = require("../models/user")

async function post(req, res, next){
    const keys = Object.keys(req.body)
    
        for (key of keys){
            if(req.body[key] == ''){
                return res.render('user/create', {
                    user: req.body,
                    error: 'Por favor, preencha todos os campos!'
                })
            }
        }

        //CHECK IF USER EXISTS [EMAIL]

        const { email } = req.body
        const user = await User.findOne({
            where: {email}
        })

        if (user) return res.render('user/create', {
            user: req.body,
            error: 'Usuário já cadastrado!'
        })

        next()
}



module.exports = {
    post
}