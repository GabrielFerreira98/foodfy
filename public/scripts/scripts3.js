const chefs = document.querySelectorAll('.chef')

for(let chef of chefs){

    chef.addEventListener("click" , function(){
        const pageId = chef.getAttribute('id')
        window.location.href = `chef/${pageId}`
    })
}


