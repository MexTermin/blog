



let inputs =  document.getElementsByTagName("input")
let imagen = document.getElementById("img_profile")
let profile = document.getElementById("profile_img")
let input = document.getElementById("profile_img_input")

if (imagen){
        imagen.addEventListener("click", () =>{ document.getElementById("profile_img_input").click(); });
        input.addEventListener("change",e =>{
                dir = input.files[0]
                url = URL.createObjectURL(dir)
                profile.setAttribute("src",url)
        });
}

if (inputs){
        for (e = 0 ; e < inputs.length; e++){
                inputs[e].setAttribute("maxlength","100");
        }
}


