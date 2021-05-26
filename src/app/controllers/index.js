const Recipe = require('../models/recipes')
const Chef = require('../models/chefs')

const LoadChef = require('../services/LoadChef')
const LoadRecipe = require('../services/LoadRecipe')

module.exports = {
    async index(req,res){

        const allRecipes = await LoadRecipe.load('recipes')

        const recipes = allRecipes

        return res.render('index/index', {recipes})
    },

    about(req,res){
        return res.render('index/about')
    },
    async recipes(req,res){
        const {filter} = req.query

        async function getImage(recipeId) {
            let files = await Recipe.files(recipeId)
            files = files.map(file =>({
                ...file,
                src: `${file.path.replace("public","")}`
            }))
        
            return files
        }

        if (filter) {
            let results = await Recipe.findBy(filter)
            recipes = results.rows

            const recipesPromise = recipes.map(async recipe => {
                const files = await getImage(recipe.id)

                recipe.img = files[0].src
                recipe.files = files

                return recipe
            })

            const lastAdded = await Promise.all(recipesPromise)
            return res.render('index/recipes', { recipes: lastAdded})
            
        } else {

            const allRecipes = await LoadRecipe.load('recipes')

            const recipes = allRecipes
            
            return res.render('index/recipes', { recipes})
        }
    },
    async showRecipe(req, res){
    
        const recipe = await LoadRecipe.load('recipe', {where: {id: req.params.id}})

        return res.render("index/recipe", { recipe })
    },
    async chefs(req, res){

        const allChefs = await LoadChef.load('chefs')

        const chefs = allChefs

        return res.render('index/chefs', { chefs })
        
    },
    async showChef(req,res){

        let chef = await LoadChef.load('chef', {where: {id: req.params.id}})

        //GET RECIPE IMAGE

        async function getImages(recipeId) {
            let files = await Recipe.files(recipeId)
            files = files.map(file =>({
                ...file,
                src: `${file.path.replace("public","")}`
            }))
        
            return files
        }
        
        results = await Chef.findRecipebyChefId(req.params.id)
        const recipes = results.rows

        const recipesPromise = recipes.map(async recipe => {
            const files = await getImages(recipe.id)
            
            recipe.img = files[0].src
            recipe.files = files

            return recipe
        })

        const lastAdded = await Promise.all(recipesPromise)


        return res.render("index/chef", { chef, recipes: lastAdded })
    }

}