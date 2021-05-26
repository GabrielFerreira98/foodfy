const Base = require('./Base')

Base.init({table: 'users'})

module.exports = {

    ...Base

}


// module.exports = {
//     async delete(id){
//         //PEGAR TODAS RECEITAS
//         let results = await db.query('SELECT * FROM recipes WHERE user_id = $1', [id])
//         const recipes = results.rows

//         //DAS RECEITAS PEGAR TODAS AS IMAGENS 
//         const allFilesPromise = recipes.map(recipe => 
//             Recipe.files(recipe.id))

//         let promiseResults = await Promise.all(allFilesPromise)

//         //RODAR A REMOÇÃO DO USUÁRIO
//         await db.query('DELETE FROM users WHERE id = $1', [id])

//         //REMOVER DA PASTA PUBLIC
//         promiseResults.map(results => {
//             results.rows.map(file => {
//                 try{
//                     fs.unlinkSync(file.path)
//                 }catch(err){
//                     console.error(err)
//                 }
//             })
//         })
//     }
// }