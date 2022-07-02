import { ArbolABB, ArbolAvl, ListaHash, NodoUser, ListaUsers, Merkle } from './estructura.js'


/**
 * DENIFICION DE VARIABLES GLOBALES
 */

let usuarios = new ListaUsers()
//usuarios.insertar("2354168452525", "Wilfred Perez", "EDD", "email@gmail.com", "123", "+502 (123) 123-4567")
let admin = new NodoUser("2354168452525", "Wilfred Perez", "EDD", "email@gmail.com", "123", "+502 (123) 123-4567")//admin
let peliculas = new ArbolAvl()
let actores = new ArbolABB()
let categ = new ListaHash()

let currentUser = null
categ.rellenar()

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
            let precio = usuario.precion_Q
            if (allCateg(["id_pelicula", "nombre_pelicula", "descripcion", "puntuacion_star", "precion_Q"], usuario)) {
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
                console.log("objecto no cumple con los atributos")
            }
        }
        categ.print()
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
                alert("aun no se han cargado peliculas")
                return
            }
            showImage(peliculas)
            break
        case 1:
            if (usuarios.primero == null) {
                alert("aun no se han cargado usuarios")
                return
            }
            showImage(usuarios)
            break
        case 2:
            if (actores.root == null) {
                alert("aun no se han cargado actores")
                return
            }
            showImage(actores)
            break
        case 3:
            if (categ.elements == 0) {
                alert("aun no se han cargado categorias")
                return
            }
            showImage(categ)
            break
        default:
            break
    }
});

/**
 * GENERA LA IMAGEN SEGUN EL ARCHIVO DOT DE LA ESTRUCTURA ENVIADA
 * @param {Object} estructura 
 */
function showImage(estructura) {
    let string = estructura.graphviz()
    d3.select("#resimage")
        .graphviz()
        .zoom(false)
        .renderDot(string)
}


/**
 * funcion para descargar la imagen
 */
document.getElementById("descargar").addEventListener("click", function () {
    //pendiente
});

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
    let elements = ["divmovieuser", "useroptions", "logview", "cargasmasivas", "formresactores", "formrespeliculas", "formrescategorias", "formresmerkle", "divactorsuser", "divmoviesuser", "divcateguser"]
    elements.forEach(element => {
        document.getElementById(element).style.display = "none"
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


function showmovie(idmovie) {
    // ocultar lista movies
    // mostrar movie especifica div
}

function alquilar(idmovie) {

}



/**
 *              FUNCIONES PARA LISTAR PELICULAS
 * /////////////////////////////////////////////////////
 * /////////////////////////////////////////////////////
 * /////////////////////////////////////////////////////
 */


/**
 * MOSTRAR LAS PELICULAS ORDENADAMENTE ASCENDENTEMENTE O DESCENDENTEMENTE
 */
document.getElementById("showorder").addEventListener("click", function () {
    let opcion = document.getElementById("ordenmovies").selectedIndex
    console.log(opcion)
    console.log(document.getElementById("listmovies").innerHTML)

    let divopcion = document.getElementById("listmovies")
    divopcion.innerHTML = ''
    if (opcion == 0) {
        console.log("ascendeten")
        addMovieAs(divopcion, peliculas.root)
    } else {
        console.log("descentente")
        addMovieDes(divopcion, peliculas.root)
    }
})



function addMovieAs(listaLibros, movie) {
    if (movie != null) {
        addMovieAs(listaLibros, movie.left) /// nodo izquierda

        let libronuevo = document.createElement('div')
        libronuevo.className = 'movienode flex-container form-control w-100'
        libronuevo.innerHTML = `
        <div class="title form-control lead">${movie.nombrePelicula}</div>
        <div class= "descripcion form-control">${movie.descripcion}</div>
        <button type="button" class="btn btn-outline-success btns form-control" onclick="showmovie(${movie.idPelicula})">Info</button>
        <button type="button" class="btn btn-outline-success btns form-control" onclick="alquilar(${movie.idPelicula})">Alquilar</button>
        <h3 class="precio form-control">Q ${movie.precio}</h3>                
        `
        listaLibros.append(libronuevo)
        addMovieAs(listaLibros, movie.right)//// nodo derecha
    }
}

function addMovieDes(listaLibros, movie) {
    if (movie != null) {
        addMovieDes(listaLibros, movie.right)//// nodo derecha

        let libronuevo = document.createElement('div')
        libronuevo.className = 'movienode flex-container form-control w-100'
        libronuevo.innerHTML = `
        <div class="title form-control lead">${movie.nombrePelicula}</div>
        <div class= "descripcion form-control">${movie.descripcion}</div>
        <button type="button" class="btn btn-outline-success btns form-control" onclick="showmovie(${movie.idPelicula})">Info</button>
        <button type="button" class="btn btn-outline-success btns form-control" onclick="alquilar(${movie.idPelicula})">Alquilar</button>
        <h3 class="precio form-control">Q ${movie.precio}</h3>
        `
        listaLibros.append(libronuevo)

        addMovieDes(listaLibros, movie.left) /// nodo izquierda
    }
}

// ascendiente
//walter bars
//carol oliver

// descendiente
//shelly bates
//jocelyn conner






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
        console.log("arbol de actores vacio")
        return
    }
    actores.printAll()
    if (opcion == 0) {
        addActorInOrder(divopcion, actores.root)
    } else if (opcion == 1) {
        console.log("descentente")
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
        return // vacia
    }
    let hash = categ.primero
    while (hash != null) {
        let node = hash.nodos.primero
        while (node != null) {
            let libronuevo = document.createElement('div')
            libronuevo.className = 'categnode form-control'
            libronuevo.innerHTML = `
            <div class="titlec form-control lead">${node.idCategoria}</div>
            <div class= "companyc form-control">${node.company}</div>     
            `
            listaLibros.append(libronuevo)
            node = node.siguiente
        }
        hash = hash.siguiente
    }
}




























hideall()

function tst() {
    let array = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50]
    console.log("mod 13")
    array.forEach(element => {
        console.log("D:" + element + " MOD:" + element % 13)
    });


    //let array = [5,10,15,20,25,30,35,40,45,50 ]
    for (let i = 0; i < array.lenght; i++) {
        console.log(array[i] % 13)

    }


    let avlexam = new ArbolAvl()
    let abbexam = new ArbolABB()
    let datosavl = [50, 10, 60, 20, 70, 30, 80, 40, 90]
    //[50, 10, 60, 20, 70, 30, 80, 40, 90
    datosavl.forEach(element => {
        avlexam.insertar(element, "fda", "afd", "sa", "c", "12")
        abbexam.insertar(element, "name", "email", "desc")
    });
    avlexam.graphviz()
    console.log("avl")
    avlexam.printAll()
    console.log("abb")
    abbexam.printAll()

    let a = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    let dim = 3
    let ii = 0
    let jj = 0
    while (ii < dim && jj < dim) {
        console.log(a[ii * dim + jj])
        ii++
        jj++
    }





    var items = [17, 10, 12, 7, 11]
    //var n, i, k, aux;
    //n = lista.length;
    console.log(items); // Mostramos, por consola, la lista desordenada
    // Algoritmo de burbuja
    var length = items.length;
    for (var i = 1; i < length; i++) {
        for (var j = 4; j < (length - i - 1); j++) {
            if (items[j] > items[j + 1]) {
                var tmp = items[j];
                items[j] = items[j + 1];
                items[j + 1] = tmp;
            }
        }
    }

    console.log(items);






    var m = new Merkle()
    for (let i = 0; i < 10; i++) {
        let rd = Math.floor(Math.random() * 50)
        m.add(rd)
    }
    m.auth()
    m.show()
    m.preorder()
    m.dotfile(m.tophash)
    //console.log(m.auxText)




}
tst()

let index = 0

function merkle() {
    var m = new Merkle()
    for (let i = 0; i < 10; i++) {
        let rd = Math.floor(Math.random() * 50)
        m.add(rd)
    }
    m.auth(index)
    return m.dot
}


function testclient() {
    hidelogin()
    hideall()
    showClient()
}


//testclient()