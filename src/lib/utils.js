module.exports = {
    
    age(timestamp){
        const today = new Date
        const birthdate = new Date(timestamp)
    
        let age = today.getFullYear() - birthdate.getFullYear()
        const month = today.getMonth() - birthdate.getMonth()
    
        if(month < 0 || month == 0 && today.getDate() < birthdate.getDate() ){
            age = age - 1;
        }
        return age
    },

    date(timestamp){
        const date = new Date(timestamp)

        const year = `${date.getUTCFullYear()}`
        const month = `0${date.getUTCMonth() + 1}`.slice(-2)
        const day = `0${date.getUTCDate()}`.slice(-2)

        return{
          iso:  (`${year}-${month}-${day}`),
          birthDay: `${day}/${month}`,
          format: (`${day}/${month}/${year}`)
        } 
    }
}