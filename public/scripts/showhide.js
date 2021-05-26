const ingredients = document.querySelectorAll(".ingredients-wrapper")

for(let ingredient of ingredients){
    const button = ingredient.querySelector('.button')
    const content = ingredient.querySelector('.content')
    button.addEventListener("click",function(){
        content.classList.toggle("active")
    })
}

