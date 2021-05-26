const Base = require('./Base')

const db = require('../../config/db')

Base.init({table: 'recipes'})

module.exports = {

    ...Base,

    findBy(filter){
        return db.query(`
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes 
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.title ILIKE '%${filter}%'
        `)
    },

    chefsSelectOptions(callback) {
        db.query(`SELECT name, id FROM chefs`, function(err, results){
            if (err) throw 'Database Error!'

            callback(results.rows)
        })
    },

    async files(id) {
        const results = await db.query(`
        SELECT * 
        FROM recipe_files
        LEFT JOIN files ON (recipe_files.file_id = files.id)
        WHERE recipe_id = $1
        `, [id])

        return results.rows
    }
}

    




// module.exports = {
//     all() {
//         return db.query(`
//         SELECT recipes.*, chefs.name AS chef_name
//         FROM recipes 
//         LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
//         ORDER BY updated_at DESC
//         `)
//     },

