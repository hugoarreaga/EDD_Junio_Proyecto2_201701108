import { ArbolABB, ArbolAvl, ListaHash, NodoUser, ListaUsers, Merkle, ListaRenta,MerkleTree } from './estructura.js'

//import { domtoimage} from  "./dom-to-image.js"
/**
 * DENIFICION DE VARIABLES GLOBALES
 */


hideall()



let usuarios = new ListaUsers()
//usuarios.insertar("2354168452525", "Wilfred Perez", "EDD", "email@gmail.com", "123", "+502 (123) 123-4567")
let admin = new NodoUser("2354168452525", "Wilfred Perez", "EDD", "email@gmail.com", "123", "+502 (123) 123-4567")//admin
let peliculas = new ArbolAvl()
let actores = new ArbolABB()
let categ = new ListaHash()


let auxtext = ""

let currentUser = null
categ.rellenar()

let currentmovie = null


/**
 * para MERKLE
 */
let merkle = new MerkleTree()

//let nodorent = null
let rentas = new ListaRenta()


/**
 * EVENT LISTENER DE LOS BOTONES DE CARGA
 */
document.getElementById("fileUsers").addEventListener('change', fillUsers, false)
document.getElementById("fileActors").addEventListener('change', fillActors, false)
document.getElementById("fileMovies").addEventListener('change', fillMovies, false)
document.getElementById("fileCateg").addEventListener('change', fillCateg, false)

/**
 * LECTURA Y CARGA DE ARCHIVOS DE CLIENTES
 * @param {file} e datos del archivo json
 */
function fillUsers(e) {
    let str = e.target.files[0]
    if (!str) { return }
    let lector = new FileReader()
    lector.onload = function (e) {
        const object = JSON.parse(e.target.result)
        for (const key in object) {
            let usuario = object[key]// objecto usuario
            let dpi = usuario.dpi
            let nombreCompleto = usuario.nombre_completo
            let nombreUsuario = usuario.nombre_usuario
            let correo = usuario.correo
            let contrasenia = usuario.contrasenia
            let telefono = usuario.telefono
            if (allCateg(["dpi", "nombre_completo", "nombre_usuario", "correo", "contrasenia", "telefono"], usuario)) {
                usuarios.insertar(dpi, nombreCompleto, nombreUsuario, correo, contrasenia, telefono)// insertar
            } else {
                console.log("objecto no cumple con los atributos")
            }
        }
        //console.log(usuarios.graphviz())
    }
    lector.readAsText(str);
}

/**
 * LECTURA Y CARGA DE ARCHIVOS DE PELICULAS
 * @param {file} e datos del archivo json
 */
function fillMovies(e) {
    let str = e.target.files[0]
    if (!str) { return }
    let lector = new FileReader()
    lector.onload = function (e) {
        const object = JSON.parse(e.target.result)
        for (const key in object) {
            let usuario = object[key]// objecto usuario
            let idPelicula = usuario.id_pelicula
            let nombrePelicula = usuario.nombre_pelicula
            let descripcion = usuario.descripcion
            let puntuacion = usuario.puntuacion_star
            let precio = usuario.precio_Q
            if (allCateg(["id_pelicula", "nombre_pelicula", "descripcion", "puntuacion_star", "precio_Q"], usuario)) {
                peliculas.insertar(idPelicula, nombrePelicula, descripcion, puntuacion, precio)// insertar
            } else {
                console.log("objecto no cumple con los atributos")
            }
        }
        peliculas.graphviz()
    }
    lector.readAsText(str);
}

/**
 * LECTURA Y CARGA DE ARCHIVOS DE ACTORES
 * @param {file} e datos del archivo json
 */
function fillActors(e) {
    let str = e.target.files[0]
    if (!str) { return }
    let lector = new FileReader()
    lector.onload = function (e) {
        const object = JSON.parse(e.target.result)
        for (const key in object) {
            let usuario = object[key]// objecto usuario
            let dni = usuario.dni
            let nombreActor = usuario.nombre_actor
            let correo = usuario.correo
            let descripcion = usuario.descripcion
            if (allCateg(["dni", "nombre_actor", "correo", "descripcion"], usuario)) {
                actores.insertar(dni, nombreActor, correo, descripcion)// insertar      
            } else {
                console.log("objecto no cumple con los atributos")
            }
        }
        actores.graphviz()
    }
    lector.readAsText(str);
}

/**
 * LECTURA Y CARGA DE ARCHIVOS DE CATEGORIAS
 * @param {file} e datos del archivo json
 * @returns 
 */
function fillCateg(e) {
    let str = e.target.files[0]
    if (!str) { return }
    let lector = new FileReader()
    lector.onload = function (e) {
        const object = JSON.parse(e.target.result)
        for (const key in object) {
            let usuario = object[key]// objecto usuario
            let categoria = usuario.id_categoria
            let company = usuario.company
            if (allCateg(["id_categoria", "company"], usuario)) {
                let id = Math.abs(categoria % 20)
                categ.agregarNodo(id, categoria, company)
            } else {
                //console.log("objecto no cumple con los atributos")
            }
        }
        //categ.print()
        categ.graphviz()
    }
    lector.readAsText(str);
}

/**
 * TEST PARA VERIFICAR QUE LOS OBJETOS SEAN LOS CORRECTOS
 * @param {list} obj lista de atributos a verificar
 * @param {Object} userObj objeto actual 
 * @returns Todos existen?
 */
function allCateg(obj, userObj) {
    return obj.every(name =>
        userObj.hasOwnProperty(name)
    );
}

/**
 * funcion para manejar el login
 */
document.getElementById("logUser").addEventListener("click", function () {
    currentUser = null
    let user = document.getElementById("floatingInput").value
    let pass = document.getElementById("floatingPassword").value
    document.getElementById("floatingPassword").value = ""
    if (user == "" || pass == "") {
        alert("tiene campos vacios")
        return
    }
    var x = document.getElementById("flexCheckDefault").checked
    if (x) {
        if (user == admin.nombreUsuario && pass == admin.contrasenia) {
            currentUser = admin
            showAdmin()
            hidelogin()
        } else { console.log("Datos de administrador incorrectos") }
    } else {
        currentUser = usuarios.getUserLogin(user, pass)
        if (currentUser != null) {
            alert("BIENVENIDO: " + currentUser.dpi)
            document.getElementById("floatingInput").value = ""
            hidelogin()
            showClient()
        } else { alert("USUARIO O CONTRASEÑA INCORRECTAS") }
    }
});

/**
 * FUNCION PARA CERRAR CESION
 */
document.getElementById("logout").addEventListener("click", function () {
    currentUser = null
    hideall()
    showLogin()
    vista =false
    document.getElementById("resimageoculto").style.display = "none"
});

/**
 * FUNCION PARA CERRAR CESION
 */
document.getElementById("logout2").addEventListener("click", function () {
    currentUser = null
    hideall()
    showLogin()
});


/**
 * FUNCION PARA MOSTRAR LAS IMAGENES DE LAS ESTRUCTURAS
 */
document.getElementById("opciones").addEventListener("change", function () {
    let selector = document.getElementById("opciones").selectedIndex
    switch (selector) {
        case 0:
            if (peliculas.root == null) {
                auxtext = ""
                alert("aun no se han cargado peliculas")
                return
            }
            showImage(peliculas,0)
            break
        case 1:
            if (usuarios.primero == null) {
                auxtext = ""
                alert("aun no se han cargado usuarios")
                return
            }
            showImage(usuarios,0)
            break
        case 2:
            if (actores.root == null) {
                auxtext = ""
                alert("aun no se han cargado actores")
                return
            }
            showImage(actores,0)
            break
        case 3:
            if (categ.elements == 0) {
                auxtext = ""
                alert("aun no se han cargado categorias")
                return
            }
            showImage(categ,0)
            break
        case 4:
            if (rentas.len == 0) {
                auxtext = ""
                alert("AUN NO SE HAN RENTADO PELICULAS")
                return
            }
            merkle.generarArbol(rentas)
            showImage(merkle,1)
            break
        default:
            break
    }
});

/**
 * GENERA LA IMAGEN SEGUN EL ARCHIVO DOT DE LA ESTRUCTURA ENVIADA
 * @param {Object} estructura 
 */
function showImage(estructura,n) {
    auxtext = estructura.graphviz()

    let width = "100%"
    if(n == 1){
        width = "400%"
    }
    //auxtext = "string"
    d3.select("#resimage")
        .graphviz()
        .zoom(false)
        .fit(true)
        .renderDot(auxtext)

    vista = true
    document.getElementById("resimageoculto").style.display = "block"
    d3.select("#resimageoculto")
        .graphviz()
        .height(width)
        .width(width)
        .zoom(false)
        .fit(true)
        .renderDot(auxtext)
}


/**
 * funcion para descargar la imagen
 */
document.getElementById("descargar").addEventListener("click", function () {
    //pendiente
    if (auxtext == "" || auxtext == null) {
        console.log(auxtext + "A")
        return
    }
    //console.log(auxtext)
    //document.getElementById("resimageoculto").style.display = "block"

    //descargarGrafo("resimage")
    try {
        setTimeout(ocultar, 6000);

        extra()
    } catch (error) {

    }
    //ocultar()

});
let vista = true
//descargar2
document.getElementById("descargar2").addEventListener("click", function () {
    let vi = document.getElementById("resimageoculto")
    if (vista) {
        vista = false
        document.getElementById("resimageoculto").style.display = "none"
    } else {
        vista = true
        document.getElementById("resimageoculto").style.display = "block"
    }
})


function descargarGrafo(_id) {
    html2canvas($('#' + _id)[0]).then(function (canvas) {
        return Canvas2Image.saveAsPNG(canvas);
        //$(".response").append(canvas);
    });
}
/**
 * FUNCION PARA DESCARGAR APARTE
 */

function extra() {

    try {
        setTimeout(ocultar, 6000)
        domtoimage.toJpeg(document.getElementById('resimageoculto'), { quality: 0.95 })
            .then(function (dataUrl) {
                var link = document.createElement('a');
                link.download = 'resultado.jpeg';
                link.href = dataUrl;
                link.click();
            });
    } catch (error) {

    }

}

function ocultar() {
    console.log("ocultando")
    //document.getElementById("resimageoculto").style.display = "none"
}

/**
 * VER PELICULAS - OCULTAR ACTORES,CATEGORIAS
 */
document.getElementById("verpelis").addEventListener("click", function () {
    document.getElementById("divmoviesuser").style.display = "block"
    document.getElementById("divactorsuser").style.display = "none"
    document.getElementById("divcateguser").style.display = "none"
});

/**
 * VER ACTORES - OCULTAR PELICULAS,CATEGORIAS
 */
document.getElementById("veractores").addEventListener("click", function () {
    document.getElementById("divmoviesuser").style.display = "none"
    document.getElementById("divactorsuser").style.display = "block"
    document.getElementById("divcateguser").style.display = "none"
});

/**
 * VER CATEG - OCULTAR PELICULAS,ACTORES
 */
document.getElementById("vercateg").addEventListener("click", function () {
    document.getElementById("divmoviesuser").style.display = "none"
    document.getElementById("divactorsuser").style.display = "none"
    document.getElementById("divcateguser").style.display = "block"
    showcateg()

});
function showAdmin() {
    document.getElementById("cargasmasivas").style.display = "block"
}

document.getElementById("return").addEventListener("click", function () {
    document.getElementById("divmovieuser").style.display = "none"
    document.getElementById("divmoviesuser").style.display = "block"
});


/**
 * MOSTRAR ELEMENTOS DEL CLIENTE
 * **ACTUALIZAR NOMBRE
 */
function showClient() {
    let elements = ["divactorsuser", "divmoviesuser", "divcateguser"]
    elements.forEach(element => {
        document.getElementById(element).style.display = "none"
    });
    document.getElementById("logview").style.display = "block"
    document.getElementById("useroptions").style.display = "block"
    document.getElementById("nameuser").innerHTML = "BIENVENIDO : " + currentUser.nombreCompleto
}






/**
 * OCULTAR TODOS LOS ELEMENTOS DEL INICIO **LOGIN       ***FALTAN ELEMENTOS
 */
function hideall() {    // ELIMNAR LOS FORMRES..
    let elements = ["divmovieuser", "useroptions", "logview", "cargasmasivas", "divactorsuser", "divcateguser", "divmoviesuser"]
    elements.forEach(element => {
        //console.log(element)
        try {

            document.getElementById(element).style.display = "none"
        } catch (error) {
            console.log(error)
        }
    });

}


/**
 * FUNCIONES PARA MOSTRAR/OCULTAR LA VISTA DEL LOGIN
 */
function showLogin() {
    document.getElementById("logindiv").style.display = "block"
}
function hidelogin() {
    document.getElementById("logindiv").style.display = "none"
}


/**
 *              FUNCIONES PARA LISTAR PELICULAS
 * /////////////////////////////////////////////////////
 * /////////////////////////////////////////////////////
 * /////////////////////////////////////////////////////
 */

/**
 * IMPRIMIR BOTONES MOVIES
 */
function tet() {
    console.log("pelicula")
}

/**
 * MOSTRAR LAS PELICULAS ORDENADAMENTE ASCENDENTEMENTE O DESCENDENTEMENTE
 */
document.getElementById("showorder").addEventListener("click", function () {
    let opcion = document.getElementById("ordenmovies").selectedIndex
    if (peliculas.root == null) {
        alert("AUN NO SE HAN CARGADO PELICULAS")
        return
    }

    let script = document.getElementById("buttonsmovies")
    //script.innerHTML = ""
    let divopcion = document.getElementById("listmovies")
    divopcion.innerHTML = ''
    if (opcion == 0) {
        addMovieAs(divopcion, peliculas.root, script)
        // addeventlistener para botones informacion
        let collection = document.getElementsByClassName("btnsas");
        for (let index = 0; index < collection.length; index++) {
            const element = collection[index];
            addvent(element.id)
        }

    } else {
        addMovieDes(divopcion, peliculas.root, script)

        // addeventlistener para botones informacion
        let collection = document.getElementsByClassName("btnsdes");
        for (let index = 0; index < collection.length; index++) {
            const element = collection[index];
            addvent(element.id)
        }
    }

})

function addvent(id) {
    document.getElementById(id).addEventListener("click", function () {
        //tet()
        showmovie(id)
    })
}

function addventrent(id) {
    document.getElementById(id).addEventListener("click", function () {
        //tet()
        //let movie = peliculas.getNode(id)
        //console.log(movie.nombrePelicula)
        //rentmovie(id)
    })
}


function addMovieAs(listaLibros, movie, script) {
    if (movie != null) {
        addMovieAs(listaLibros, movie.left, script) /// nodo izquierda
        //let classbtn = "btn btn-outline-success btns form-control"  // reducir size

        let libronuevo = document.createElement('div')
        libronuevo.className = 'movienode flex-container form-control w-100'


        /**ELEMENTOS DE NODO MOVIE */

        /**nombre */
        let divname = document.createElement("div")
        let moviename = document.createTextNode(movie.nombrePelicula)
        divname.appendChild(moviename)
        divname.setAttribute("class", "title form-control lead")
        /**descripcion */
        let divdesc = document.createElement("div")
        let moviedesc = document.createTextNode(movie.descripcion)
        divdesc.appendChild(moviedesc)
        divdesc.setAttribute("class", "descripcion form-control")
        /**informacion */
        let btninfo = document.createElement("button")
        let info = document.createTextNode("INFO")
        btninfo.appendChild(info)
        btninfo.setAttribute("class", "btn btn-outline-success btnsas btns form-control")

        btninfo.setAttribute("id", movie.idPelicula)
        //  btninfo.setAttribute("onclick",'tet()')

        /**alquilar */
        let btnalquilar = document.createElement("button")
        let alq = document.createTextNode("Alquilar")
        btnalquilar.appendChild(alq)
        if (movie.disponible) {
            btnalquilar.setAttribute("disabled", "false")
        } else {
            btnalquilar.setAttribute("disabled", "true")
        }
        btnalquilar.setAttribute("id", movie.idPelicula)
        btnalquilar.setAttribute("class", "btn btn-outline-success btns btns form-control")
        //  btnalquilar.setAttribute("onclick",'tet()')
        /**precio */
        let precio = document.createElement("button")
        let textprecio = document.createTextNode(movie.precio)
        precio.appendChild(textprecio)
        precio.setAttribute("class", "precio form-control")

        /**UNIR TODOS */
        libronuevo.appendChild(divname)
        libronuevo.appendChild(divdesc)
        libronuevo.appendChild(btninfo)
        libronuevo.appendChild(btnalquilar)
        libronuevo.appendChild(precio)

        listaLibros.innerHTML += libronuevo.outerHTML


        //listaLibros.append(libronuevo)
        addMovieAs(listaLibros, movie.right, script)//// nodo derecha
    }
}

function addMovieDes(listaLibros, movie, script) {
    if (movie != null) {
        addMovieDes(listaLibros, movie.right, script)//// nodo derecha

        let libronuevo = document.createElement('div')
        libronuevo.className = 'movienode flex-container form-control w-100'

        /**ELEMENTOS DE NODO MOVIE */

        /**nombre */
        let divname = document.createElement("div")
        let moviename = document.createTextNode(movie.nombrePelicula)
        divname.appendChild(moviename)
        divname.setAttribute("class", "title form-control lead")
        /**descripcion */
        let divdesc = document.createElement("div")
        let moviedesc = document.createTextNode(movie.descripcion)
        divdesc.appendChild(moviedesc)
        divdesc.setAttribute("class", "descripcion form-control")
        /**informacion */
        let btninfo = document.createElement("button")
        let info = document.createTextNode("INFO")
        btninfo.appendChild(info)
        btninfo.setAttribute("id", movie.idPelicula)
        btninfo.setAttribute("class", "btn btn-outline-success btnsdes btns form-control")
        //  btninfo.setAttribute("onclick",'tet()')

        /**alquilar */
        let btnalquilar = document.createElement("button")
        let alq = document.createTextNode("Alquilar")
        btnalquilar.appendChild(alq)
        if (movie.disponible) {
            btnalquilar.setAttribute("disabled", "false")
        } else {
            btnalquilar.setAttribute("disabled", "true")
        }

        btnalquilar.setAttribute("id", movie.idPelicula)
        btnalquilar.setAttribute("class", "btn btn-outline-success btns form-control")
        //btnalquilar.setAttribute("onclick",'tet()')
        /**precio */
        let precio = document.createElement("button")
        let textprecio = document.createTextNode(movie.precio)
        precio.appendChild(textprecio)
        precio.setAttribute("class", "precio form-control")

        /**UNIR TODOS */
        libronuevo.appendChild(divname)
        libronuevo.appendChild(divdesc)
        libronuevo.appendChild(btninfo)
        libronuevo.appendChild(btnalquilar)
        libronuevo.appendChild(precio)


        listaLibros.append(libronuevo)

        addMovieDes(listaLibros, movie.left, script) /// nodo izquierda
    }
}


/**
 * FUNCIONES PARA PELICULAS ESPECIFICAS
 */
function showmovie(id) {
    document.getElementById("divmoviesuser").style.display = "none"
    document.getElementById("divmovieuser").style.display = "block"
    currentmovie = null
    currentmovie = peliculas.getNode(id)

    document.getElementById("pricemovie").innerHTML = "Precio: Q " + currentmovie.precio
    document.getElementById("puntuacion").value = currentmovie.puntuacion//ptsaux
    document.getElementById("ptsaux").innerHTML = "Calificacion: " + currentmovie.puntuacion
    document.getElementById("titlemovie").innerHTML = "PELICULA: " + currentmovie.nombrePelicula
    document.getElementById("descmovie").innerHTML = currentmovie.descripcion

    document.getElementById("username").innerHTML = currentUser.nombreUsuario

    let rentar = document.getElementById("rentmovie")

    if (currentmovie.getDisponible() == true) {
        rentar.disabled = false
        //rentar.setAttribute("disabled","false")
    } else {
        rentar.disabled = true
        //rentar.setAttribute("disabled","true")
    }
    showcoments()
}

document.getElementById("changepnts").addEventListener("click", function () {
    let puntuacion = document.getElementById("puntuacion").value

    currentmovie.puntuacion = puntuacion

    document.getElementById("ptsaux").innerHTML = "Calificacion: " + currentmovie.puntuacion
})

/**
 * SHOW COMENTS
 */
function showcoments() {
    let coments = document.getElementById("listcoments")
    coments.innerHTML = ""
    let moviecoments = currentmovie.comentarios
    moviecoments.forEach(element => {
        let libronuevo = document.createElement('div')
        libronuevo.className = 'comentnode input-group flex-nowrap'

        libronuevo.innerHTML = `
        <span class="input-group-text">${element[0]}</span>
        <textarea class="form-control" disabled= "true">${element[1]}</textarea>       
        `
        coments.append(libronuevo)
    });

}

/**  **boton listener
 * realizar comentario
 * GUARDADRLO A LA LISTA Y RECARGAR LOS DATOS
 */
function newComent() {
    let coment = document.getElementById("newcoment").value
    let user = currentUser.nombreUsuario
    //currentmovie.comentarios.append([user,coment]) 
    currentmovie.agregarComentario(user, coment)
    document.getElementById("newcoment").value = ""
    showcoments()
}

/**LISTENER DEL BOTON PARA UN NUEVO COMENTARIO */
document.getElementById("comentar").addEventListener("click", function () {
    let coment = document.getElementById("newcoment").value
    if (coment == "") {
        return
    }
    newComent()
})


/**
 * boton de vista pelicual para rentar
 */

document.getElementById("rentmovie").addEventListener("click", function () {
    if (currentmovie.getDisponible()) {
        currentmovie.setDisponible(false)
        document.getElementById("rentmovie").disabled = true
        //console.log("Rentado: " + currentmovie.nombrePelicula)
        let entrada = currentUser.nombreCompleto + " - " + currentmovie.nombrePelicula
        console.log(entrada)
        rentas.insertar(entrada)

    }
})




/**
 *              FUNCIONES PARA LISTAR ACTORES
 * /////////////////////////////////////////////////////
 * /////////////////////////////////////////////////////
 * /////////////////////////////////////////////////////
 */


/**
 * MOSTRAR LAS PELICULAS ORDENADAMENTE ASCENDENTEMENTE O DESCENDENTEMENTE
 */
document.getElementById("showtreeorder").addEventListener("click", function () {
    let opcion = document.getElementById("ordenactors").selectedIndex
    let divopcion = document.getElementById("listactors")
    divopcion.innerHTML = ''
    if (actores.root == null) {
        alert("AUN NO SE HAN CARGADO ARCHIVOS DE ACTORES")
        return
    }
    //actores.printAll()
    if (opcion == 0) {
        addActorInOrder(divopcion, actores.root)
    } else if (opcion == 1) {
        addActorPreOrder(divopcion, actores.root)
    } else if (opcion == 2) {
        addActorPostOrder(divopcion, actores.root)
    }
})
function addActorInOrder(listaLibros, actor) {
    if (actor != null) {
        addActorInOrder(listaLibros, actor.left) /// nodo izquierda

        let libronuevo = document.createElement('div')
        libronuevo.className = 'actornode flex-container form-control w-100'
        libronuevo.innerHTML = `
        <div class="titlea form-control lead">${actor.nombreActor} - ${actor.dni}</div>
        <div class= "correoa form-control">${actor.correo}</div>     
        <div class= "descripciona form-control">${actor.descripcion}</div>       
        `
        listaLibros.append(libronuevo)
        addActorInOrder(listaLibros, actor.right)//// nodo derecha
    }
}

function addActorPreOrder(listaLibros, actor) {
    if (actor != null) {
        let libronuevo = document.createElement('div')
        libronuevo.className = 'actornode flex-container form-control w-100'
        libronuevo.innerHTML = `
        <div class="titlea form-control lead">${actor.nombreActor} - ${actor.dni}</div>
        <div class= "correoa form-control">${actor.correo}</div>     
        <div class= "descripciona form-control">${actor.descripcion}</div>       
        `
        listaLibros.append(libronuevo)

        addActorPreOrder(listaLibros, actor.left) /// nodo izquierda
        addActorPreOrder(listaLibros, actor.right)//// nodo derecha
    }
}

function addActorPostOrder(listaLibros, actor) {
    if (actor != null) {
        addActorPostOrder(listaLibros, actor.left) /// nodo izquierda
        addActorPostOrder(listaLibros, actor.right)//// nodo derecha

        let libronuevo = document.createElement('div')
        libronuevo.className = 'actornode flex-container form-control w-100'
        libronuevo.innerHTML = `
        <div class="titlea form-control lead">${actor.nombreActor} - ${actor.dni}</div>
        <div class= "correoa form-control">${actor.correo}</div>     
        <div class= "descripciona form-control">${actor.descripcion}</div>       
        `
        listaLibros.append(libronuevo)
    }
}





/**
 *              FUNCIONES PARA LISTAR CATEGORIAS
 * /////////////////////////////////////////////////////
 * /////////////////////////////////////////////////////
 * /////////////////////////////////////////////////////
 */


/**
 * MOSTRAR LAS CATEGORIAS ORDENADAMENTE
 */

function showcateg() {
    let listaLibros = document.getElementById("listacateg")
    listaLibros.innerHTML = ""
    if (categ.elements == 0) {
        alert("AUN NO SE HAN CARGADO ARCHIVOS DE CATEGORIA")
        return // vacia
    }
    let hash = categ.primero
    while (hash != null) {
        let node = hash.nodos.primero
        while (node != null) {
            let libronuevo = document.createElement('div')
            libronuevo.className = 'categnode form-control'
            libronuevo.innerHTML = `
            <div class="titlec form-control lead">Company <b>${node.idCategoria}<b></div>
            <hr>
            <div class= "companyc form-control">${node.company}</div><hr>     
            `
            listaLibros.append(libronuevo)
            node = node.siguiente
        }
        hash = hash.siguiente
    }
}






















