const {date} = require('../../lib/utils')
const Chef = require('../models/chefs')
const File = require('../models/file')
const Recipe = require('../models/recipes')

const LoadChef = require('../services/LoadChef')

const fs = require('fs')


module.exports = {
    async index(req,res) {

        try {

            const allChefs = await LoadChef.load('chefs')

            const chefs = allChefs

            return res.render('admin/chefs', { chefs })

        } catch (error) {
            console.error(error);
        }

    },

    async show(req, res){

        try {

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


        return res.render("admin/chef", { chef, recipes: lastAdded })

        } catch (error) {
            console.error(error);
        }
        
        
    },
    create(req, res){
        try {

            return res.render('admin/createChef')
    
        } catch (error) {
            console.error(error);
        }
    },
    async post(req, res){

        try {
            const filesPromise = req.files.map(async file =>{
                let chefFileResult = await File.createFile({...file});
                const file_id = chefFileResult.rows[0].id

                await Chef.create({
                    ...req.body,
                    file_id,
                    created_at: date(Date.now()).iso
                })
            })
            await Promise.all(filesPromise)

            return res.redirect(`/admin/chefs`)

        } catch (error) {
            console.error(error);
        }   
    },

    async edit(req, res){

        try {
            let chef = await LoadChef.load('chef', {where: {id: req.params.id}})

            return res.render("admin/editChef", { chef })

        } catch (error) {
            console.error(error);
        }
    },
    async put(req, res){

        try {
            if(req.body.removed_files) {
                
                const removedFiles = req.body.removed_files.split(",")
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)

                const removedFilesPromise = removedFiles.map(id => File.delete(id))

                await Promise.all(removedFilesPromise)
            }

            const { id, name } = req.body

            if (req.files.length != 0){
                const filesPromise = req.files.map(async file =>{
                    let chefFileResult = await File.createFile({...file});
                    const file_id = chefFileResult.rows[0].id
        
                    await Chef.update(id, {
                        file_id,
                        name
                    })
                })
                await Promise.all(filesPromise)
            }

            await Chef.update(id, {name})
            
            return res.redirect(`/admin/chef/${req.body.id}`)

        } catch (error) {
            console.error(error);
        }

    },
    async delete(req, res){
    try{

        const files = await Chef.files(req.body.id)

        await Chef.delete(req.body.id)

        files.map(file => {
            try{
                fs.unlinkSync(file.path)
            }catch(err){
                console.error(err)
            }
        })
        
        return res.redirect('chefs')

        } catch (error) {
            console.error(error);
        } 
    }
}