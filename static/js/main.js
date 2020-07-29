

let imagen = document.getElementById("img_profile")
imagen.addEventListener("click", ()=>{
        document.getElementById("profile_img_input").click()
})

let profile = document.getElementById("profile_img")
let input = document.getElementById("profile_img_input")
input.addEventListener("change",()=>{
        dir = input.files[0]
        url = URL.createObjectURL(dir)
        profile.setAttribute("src",url)
})