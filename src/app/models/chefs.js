const db = require('../../config/db')
const Base = require('./Base')

Base.init({table: 'chefs'})

module.exports = {
    ...Base,

    async files(id){
        const results = await db.query(`
        SELECT *
        FROM chefs
        LEFT JOIN files ON (chefs.file_id = files.id)
        WHERE chefs.id = $1
        `, [id])

        return results.rows
    },

    findRecipebyChefId(id){
        return db.query(`
        SELECT *
        FROM chefs
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        WHERE chefs.id = $1
        `, [id])
    },

    async all() {
        const query = `
        SELECT chefs.*, count(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        GROUP BY chefs.id
        ORDER BY total_recipes DESC`

        const results = await db.query(query)
        return results.rows
    }
}
