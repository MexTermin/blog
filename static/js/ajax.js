// --------------------------Create object Ajax------------------------------
function objectAjax(){
    if (window.XMLHttpRequest){
        return new XMLHttpRequest();
    }
    else{
        return new ActiveXObject(Microsoft.XMLHTTP);
    }
}

// --------------seleciona el boton que hace el submit de los datos-----------
let buttoncoment = document.getElementsByClassName("submit-coment")
// -------------------------------Envia los datos del nuevo comentario al servidor -------
let comments = (e) =>{
    // ---------------Toma el ID del contenedor mayor del post----------------
    console.log(e)
    id = e.path[0].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("id")
    // --------------- toma el valor del comentario----------
    comentario = e.path[0].parentNode.children.comment.value
    if (comentario != ""){
        ajax = objectAjax()
        //--------datos a enviar al servidor-----------
        datos = "post_id=" + id + "&comment=" + comentario
        //configuracion de ajax
        ajax.open("POST","/comentar",true)
        ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        ajax.send(datos)
        // limpia el input del comentario al enviarse la peticion
        e.path[0].parentNode.children.comment.value = ""
    }

}
// asgina el la funcion que envia los datos al servidor de los comentarios de cada post
for (i = 0; i<buttoncoment.length;i++){
    buttoncoment[i].addEventListener("click",comments, true)
}



async function comentarios (post_id){
    //--Funcion encargada de agregar los nuevos comentarios a la pagina
    let post = document.getElementById(post_id) // contenedor de cada post

    // codigo html de cada tarjeta de los comentarios
    html =  `
            <div class="notas-comentarios">
                <div class="user-notas-comentarios">
                    <div class="comment-container">
                        <div id="comentarios-div-img">
                            <img src=/public/image/%s  alt="">
                        </div>
                        <span id="comentarios-nombre">%s %s -> </span>
                    </div>
                    <div class="notas-comentarios-descripcion">
                        <p> %s </p>
                    </div>
                </div>
            </div>
            `
    
           
        ajax = objectAjax()
        url = "/comentar/" + post_id
        ajax.open("GET",url,true)
        ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        nod = document.createElement("div")
        
        // console.log(ajax)
        ajax.onreadystatechange=  () =>{
            if(ajax.readyState == 4 && ajax.status == 200){
                let resultado = JSON.parse(ajax.responseText)
                let oldLen =  post.getElementsByClassName("all_comments")[0].children.length
                let newLen = parseInt(resultado.length)
                // console.log(oldLen + "   "+newLen)
                // console.log(ajax)

            if (oldLen < newLen){
                for (var li = oldLen -1 ; li < ( newLen - 1); i++){
                    ajax2 = objectAjax()
                    ajax2.open("GET","/get_user/"+resultado[li+1][2],true)
                    ajax2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    ajax2.onreadystatechange = () =>{
                        // console.log(this.ajax2)
                        if(this.ajax2.readyState == 4 && this.ajax2.status == 200){
                            let user =   JSON.parse(ajax2.responseText)
                            lista = [user[3],user[0],user[1],resultado[li+1][3]]
                            // console.log(lista)
 
                            for ( var i in  lista ){
                    
                                html = html.replace("%s",lista[i])
                            }
                            
                            nod.innerHTML = html;
                        }
                        
                    }
                    // console.log(post[index])
                    post.getElementsByClassName("all_comments")[0].appendChild(nod);
                    ajax2.send()
                    break;

                    }
            }
        }
        
    }
    ajax.send()
}



 setInterval(()=>{
    //    comentarios(17)
    tcomentarios = document.getElementsByClassName("all_comments")
    for (i = 0; i< tcomentarios.length;i++){
        if (tcomentarios[i].classList.contains("show-comm")){
            id = tcomentarios[i].parentNode.parentNode.parentNode.id
            comentarios(id)
        }
    }

    },3500)
    
// comentarios(17)