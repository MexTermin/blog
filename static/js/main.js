



let inputs =  document.getElementsByTagName("input")
let imagen = document.getElementById("img_profile")
let profile = document.getElementById("profile_img")
let input = document.getElementById("profile_img_input")
let showComents = document.getElementsByClassName("show-comments")
let allComents = document.getElementsByClassName("all_comments")
let logout = document.getElementById("logout")

function cliked (e){
        coments = e.path[2].children[1]
        coments.classList.toggle("show-comm")
        if (coments.classList.contains("show-comm")){
                coments.style.display = "block"
                
                // allComents[i].classList.toggle("show-comm")
                

        }else{
                coments.style.display = "none"
        }
}
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

if (showComents.length > 0){
        for (i = 0; i < showComents.length; i++){
                // console.log(i)
                // var a = showComents[i].parentNode.parentNode
                // var a = a.children[1]
                showComents[i].addEventListener("click",cliked,false)
                
        }
}

if (allComents){
        for (i = 0; i < allComents.length; i++){
                if (allComents[i].classList.contains("show-comm")){
                        allComents[i].style.display = "block"
                        // allComents[i].classList.toggle("show-comm")
                }else{
                        allComents[i].style.display = "none"
                }
                
        }
}

if(logout){

        logout.addEventListener("click",e=>{
                opcion = confirm("¿Desea cerrar sessión?")
                if( opcion != true){
                        e.preventDefault()
                }
        })
}