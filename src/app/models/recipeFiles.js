const Base = require('./Base')

const db = require('../../config/db')


Base.init({table: 'recipe_files'})

module.exports = {

    ...Base,

}