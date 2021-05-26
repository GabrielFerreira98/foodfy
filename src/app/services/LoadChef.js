const Chef = require('../models/chefs')

const { date } = require('../../lib/utils')



async function getImages(chefId) {
    let files = await Chef.files(chefId)
    files = files.map(file =>({
        ...file,
        src: `${file.path.replace("public","")}`
    }))

    return files
}

async function format(chef){
    const files = await getImages(chef.id)
    chef.img = files[0].src
    chef.files = files

    return chef
}

const LoadChef = {
    async load(service, filter){
        this.filter = filter
        return this[service]()
    },

    async chef(){
        try {
            const chef = await Chef.findOne(this.filter)
            return format(chef)
        } catch (error) {
            console.error(error)
        }
    },

    async chefs(){
        try {
            const chefs = await Chef.all(this.filter)
            const chefsPromise = chefs.map(format)

            return Promise.all(chefsPromise)
        } catch (error) {
            console.error(error)
        }
    },

    format,

}



module.exports = LoadChef