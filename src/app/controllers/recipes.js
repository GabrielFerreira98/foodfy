const Recipe = require('../models/recipes')
const File = require('../models/file')
const RecipeFiles = require('../models/recipeFiles')

const {date} = require('../../lib/utils')

const LoadRecipe = require('../services/LoadRecipe')

const fs = require('fs')

module.exports = {
    async index(req, res){
        const {filter} =  req.query 

        async function getImage(recipeId) {
            let files = await Recipe.files(recipeId)
            files = files.map(file =>({
                ...file,
                src: `${file.path.replace("public","")}`
            }))
        
            return files
        }

        if ( filter ){

            let results = await Recipe.findBy(filter)
            recipes = results.rows

            const recipesPromise = recipes.map(async recipe => {
                const files = await getImage(recipe.id)

                recipe.img = files[0].src
                recipe.files = files

                return recipe
            })

            const lastAdded = await Promise.all(recipesPromise)
            return res.render('admin/recipes', { recipes: lastAdded})
            
        }else{
            const allRecipes = await LoadRecipe.load('recipes')

            const recipes = allRecipes
            
            return res.render('admin/recipes', { recipes})
        }
    },

    async show(req, res){

        try {
            const recipe = await LoadRecipe.load('recipe', {where: {id: req.params.id}})

            return res.render("admin/recipe", { recipe })

        } catch (error) {
            console.error(error);
        }
        
    },
    async create(req, res){
        try {
            Recipe.chefsSelectOptions(function(options){
                return res.render('admin/create', { chefOptions: options})
            })
        } catch (error) {
            console.error(error);
        }      
    },
    async post(req, res){

        try {
            let recipe_id = await Recipe.create({
                ...req.body,
                user_id: req.session.userId,
                created_at: date(Date.now()).iso
            })
    
            const filesPromise = req.files.map(file => File.createFile({...file}))
            const filesResults = await Promise.all(filesPromise)
            
            const recipeFiles = filesResults.map(file => RecipeFiles.create({file_id: file.rows[0].id, recipe_id}))
            await Promise.all(recipeFiles)
    
    
            return res.render('confirmation-lottie/sucess')

        } catch (error) {
            console.error(error);
            return res.render('confirmation-lottie/error')
        }
    },
    async edit(req, res){

        try {
            const recipe = await LoadRecipe.load('recipe', {where: {id: req.params.id}})

            Recipe.chefsSelectOptions(function(options){
                return res.render("admin/edit", { recipe, chefOptions: options })
            })
        } catch (error) {
            console.error(error);
        }
        
    },
    async put(req, res){

        try {
            if (req.files.length != 0){
                const newFilesPromise = req.files.map(file => 
                    File.createFile({...file}))

                    newFilesResults = await Promise.all(newFilesPromise)
                
                const newRecipeFiles = newFilesResults.map(file => RecipeFiles.create({file_id: file.rows[0].id, recipe_id: req.body.id}))
                await Promise.all(newRecipeFiles)
            }

            if (req.body.removed_files){
                const removedFiles = req.body.removed_files.split(",")
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex,1)

                const removedFilesPromise = removedFiles.map(id => File.delete(id))

                await Promise.all(removedFilesPromise)
            }
            
            const { id, title, chef_id, ingredients, preparation, information } = req.body

            await Recipe.update(id, { 
                title, 
                chef_id, 
                ingredients, 
                preparation, 
                information
            })

            return res.redirect(`/admin/recipe/${req.body.id}`)

        } catch (error) {
            console.error(error);
        }
        
    },
    async delete(req, res){
        try {

            const files = await Recipe.files(req.body.id)

            await Recipe.delete(req.body.id)

            files.map(file => {
                try{
                    fs.unlinkSync(file.path)
                }catch(err){
                    console.error(err)
                }
            })
            
            return res.redirect('/admin/recipes')

        } catch (error) {
            console.error(error);
        }
    }
}
