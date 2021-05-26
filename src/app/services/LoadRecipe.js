const Recipe = require('../models/recipes')

async function getImages(recipeId) {
    let files = await Recipe.files(recipeId)
    files = files.map(file =>({
        ...file,
        src: `${file.path.replace("public","")}`
    }))

    return files
}

async function format(recipe){
    const files = await getImages(recipe.id)
    recipe.img = files[0].src
    recipe.files = files

    return recipe
}

const LoadRecipe = {
    async load(service, filter){
        this.filter = filter
        return this[service]()
    },

    async recipe(){
        try {
            const recipe = await Recipe.findOne(this.filter)
            return format(recipe)
        } catch (error) {
            console.error(error)
        }
    },

    async recipes(){
        try {
            const recipes = await Recipe.findAll(this.filter, {
                tableB: 'chefs', 
                rule:'recipes.chef_id = chefs.id',
                aliases: 'chefs.name AS chef_name'
            })
            const recipesPromise = recipes.map(format)

            return Promise.all(recipesPromise)
        } catch (error) {
            console.error(error)
        }
    },

    format,

}



module.exports = LoadRecipe