const User = require('../models/user')
const Recipe = require('../models/recipes')

function onlyUsers(req, res, next){
    if(!req.session.userId)
        return res.redirect('/users/login')
    next()
}

function isLoggedRedirectToUsers(req, res, next){
    if(req.session.userId)
        return res.redirect('/users/profile')
    
    next()
}

function isAdmin(req, res, next){
    if(req.session.is_admin != true){
        return res.redirect('/users/profile')
    }

    next()
}

async function recipeOwner(req, res, next){
    if (!req.session.userId) return res.redirect("/users/login")
    
    let id = req.body.id
    if(!id) id = req.params.id

    let recipe = await Recipe.findOne({where: {id: req.params.id}})

    if(recipe.user_id != req.session.userId && req.session.is_admin == false)
        return res.redirect("/admin/recipes")

    next()
}

module.exports = {
    onlyUsers,
    isLoggedRedirectToUsers,
    isAdmin,
    recipeOwner
}

