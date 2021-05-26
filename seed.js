const faker = require('faker')
const { hash } = require('bcryptjs')

const {date} = require('./src/lib/utils')

const Recipe = require('./src/app/models/recipes')
const Chef = require('./src/app/models/chefs')
const File = require('./src/app/models/file')
const User = require('./src/app/models/user')
const RecipeFiles = require('./src/app/models/recipeFiles')

let usersIds = []
let recipesIds = []
let chefsIds = []
let filesIds = []
let totalRecipes = 10
let totalChefs = 5
let totalUsers = 3

async function createUsers() {
    const users = []
    const password = await hash('1111', 8)

    while(users.length < totalUsers) {
        users.push({
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password,
            is_admin: faker.datatype.boolean()
        })
    }
    
    const usersPromise = users.map(user => User.create(user))

    usersIds = await Promise.all(usersPromise)
}

async function createChef(){
    let chefs = []
    let file = []

    while(chefs.length < totalChefs ){

        file.push({
            filename: faker.image.image(),
            path: `public/images/placeholder.png`
        })

        let filePromise = await File.createFile(...file)

        const file_id = filePromise.rows[0].id

        chefs.push({
            name: faker.name.firstName(),
            created_at: date(Date.now()).iso,
            file_id: file_id
        })
    }

    const chefsPromise = chefs.map(chef => Chef.create(chef))

    chefsIds = await Promise.all(chefsPromise)

}

async function createRecipes(){
    let recipes = []

    while(recipes.length < totalRecipes){
        recipes.push({
            title: faker.name.title(),
            chef_id: Math.ceil(Math.random() * totalChefs),
            user_id: Math.ceil(Math.random() * totalUsers),
            ingredients: faker.lorem.paragraph(Math.ceil(Math.random() * 5)).split('. '), 
            preparation: faker.lorem.paragraph(Math.ceil(Math.random() * 4)).split('. '), 
            information: faker.lorem.paragraph(Math.floor(Math.random() * 3)),
            created_at: date(Date.now()).iso
        })
    }

    const recipePromise = recipes.map(recipe => Recipe.create(recipe))
    recipesIds = await Promise.all(recipePromise)

    let files = []
    let recipeFiles = []

    while(files.length < 30){
        files.push({
            name: faker.image.image(),
            path: `public/images/placeholder.png`,
        })
    }

    const filesPromise = files.map(file => File.create(file))
    filesIds = await Promise.all(filesPromise)

    while(recipeFiles.length < 30){
        recipeFiles.push({
            recipe_id: Math.ceil(Math.random() * totalRecipes),
            file_id: filesIds[Math.floor(Math.random() * filesIds.length)]
        })
    }

    const recipeFilesPromise = recipeFiles.map(recipefile => RecipeFiles.create(recipefile))
    await Promise.all(recipeFilesPromise)

}

async function init(){
    await createUsers()
    await createChef()
    await createRecipes()
}

init()



