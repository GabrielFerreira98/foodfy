const PhotosUpload = {
    input: "",
    uploadLimit: 5,
    uploadChefLimit: 1,
    preview:document.querySelector('#photos-preview'),
    files:[],  
    handleFileInput(event) {
        const { files : fileList} = event.target
        PhotosUpload.input = event.target

        if (PhotosUpload.hasLimit(event)) return 

        Array.from(fileList).forEach(file => {

            PhotosUpload.files.push(file)
            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = PhotosUpload.getContainer(image)
                PhotosUpload.preview.appendChild(div)
            }

            reader.readAsDataURL(file)
        })

        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },
    
    handleChefFileInput(event) {
        const { files : fileList} = event.target
        PhotosUpload.input = event.target

        if (PhotosUpload.chefHasLimit(event)) return 

        Array.from(fileList).forEach(file => {

            PhotosUpload.files.push(file)
            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = PhotosUpload.getContainer(image)
                PhotosUpload.preview.appendChild(div)
            }

            reader.readAsDataURL(file)
        })

        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },

    getContainer(image){
        const div = document.createElement('div')
        div.classList.add('photo')

        div.onclick = PhotosUpload.removePhoto

        div.appendChild(image)

        div.appendChild(PhotosUpload.getRemoveButton())

        return div
    },

    hasLimit(event){
        const { uploadLimit, input, preview } = PhotosUpload
        const { files: fileList } = input 

        if (fileList.length > uploadLimit) {
            alert(`Envie no m??ximo ${uploadLimit} fotos!`)
            event.preventDefault()
            return true
        }

        const photosDiv = []
        preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value=="photo")
                photosDiv.push(item)
        })

        const totalPhotos = fileList.length + photosDiv.length
        if(totalPhotos > uploadLimit){
            alert('Voc?? atingiu o limite m??ximo de fotos!')
            event.preventDefault()
            return true
        }

        return false 
    },

    chefHasLimit(event){
        const { uploadChefLimit, input, preview } = PhotosUpload
        const { files: fileList } = input 

        if (fileList.length > uploadChefLimit) {
            alert(`Envie no m??ximo ${uploadChefLimit} fotos!`)
            event.preventDefault()
            return true
        }

        const photosDiv = []
        preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value=="photo")
                photosDiv.push(item)
        })

        const totalPhotos = fileList.length + photosDiv.length
        if(totalPhotos > uploadChefLimit){
            alert('Voc?? atingiu o limite m??ximo de fotos!')
            event.preventDefault()
            return true
        }

        return false 
    },

    getAllFiles(){
        const dataTransfer = new DataTransfer()

        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },

    getRemoveButton(){
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = 'X'
        

        return button
    },

    removePhoto(event) {
        const photoDiv = event.target.parentNode
        const photosArray = Array.from(PhotosUpload.preview.children)
        const index = photosArray.indexOf(photoDiv)

        PhotosUpload.files.splice(index, 1)
        PhotosUpload.input.files = PhotosUpload.getAllFiles()

        photoDiv.remove()
    },

    removeOldPhoto(event){
        const photoDiv = event.target.parentNode

        if (photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"')
            if (removedFiles) {
                removedFiles.value += `${photoDiv.id},`
            }
        }

        photoDiv.remove()
    }
}

const ImageGallery = {
    highlight: document.querySelector('.food-image .highlight > img '),
    previews: document.querySelectorAll('.gallery-preview img'),
    setImage(e) {
        const { target } = e

        ImageGallery.previews.forEach(preview => preview.classList.remove('active'))

        target.classList.add('active')

        ImageGallery.highlight.src = target.src
    }
}

const Validate = {
    apply(input, func){

        Validate.clearErrors(input)

        let results = Validate[func](input.value)
        input.value = results.value

        if (results.error)
            Validate.displayError(input, results.error)

    },

    displayError(input, error){

        const div = document.createElement('div')
        div.classList.add('error')
        div.innerHTML = error
        input.parentNode.appendChild(div)
        input.focus()
    },

    clearErrors(input){
        const errorDiv = input.parentNode.querySelector('.error')
        if (errorDiv)
            errorDiv.remove()
    },

    isEmail(value){
        let error = null

        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if (!value.match(mailFormat))
            error = "Email Inv??lido"
        return {
            error,
            value
        }
    },

    allFields(e){
        const items = document.querySelectorAll('.individualForm input, .individualForm select, .individualForm textarea')
        
        for(item of items ){
            if (item.value == ""){
                const message = document.createElement('div')
                message.classList.add('messages')
                message.classList.add('error')
                message.style.position = 'fixed'
                
                message.innerHTML = 'Todos os campos s??o obrigat??rios.'
                document.querySelector('body').append(message)

                e.preventDefault()
            }
        }
    }
}