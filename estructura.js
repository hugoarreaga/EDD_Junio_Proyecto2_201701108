/////////////////////////////////////////////// 
/**
 *                                                      LSITA SIMPLE DE CLIENTES
*/
///////////////////////////////////////////////
class NodoUser {
    constructor(dpi, nombreCompleto, nombreUsuario, correo, contrasenia, telefono) {
        this.dpi = dpi
        this.nombreCompleto = nombreCompleto
        this.nombreUsuario = nombreUsuario
        this.correo = correo
        this.contrasenia = contrasenia
        this.telefono = telefono
        this.node = "N" + dpi
        this.siguiente = null
    }
}

class ListaUsers {
    constructor() {
        this.primero = null
        this.ultimo = null
        this.size = 0
        this.auxText = ""
    }
    getUser(dpi) {
        let temp = this.primero
        while (temp != null) {
            if (temp.dpi == dpi) {
                return temp
            }
            temp = temp.siguiente
        }
        return null
    }

    getUserLogin(user, pass) {
        let temp = this.primero
        while (temp != null) {
            if (temp.nombreUsuario == user && temp.contrasenia == pass) {
                return temp
            }
            temp = temp.siguiente
        }
        return null
    }

    insertar(dpi, nombreCompleto, nombreUsuario, correo, contrasenia, telefono) {
        let nuevo = new NodoUser(dpi, nombreCompleto, nombreUsuario, correo, contrasenia, telefono)
        if (this.primero == null) {
            this.primero = nuevo
            this.ultimo = nuevo
        } else if (this.getUser(dpi) == null) {
            this.ultimo.siguiente = nuevo
            this.ultimo = nuevo

        } else {
            console.log("ya existe el usuario con el dpi: " + dpi)
        }
    }

    printUsers() {
        if (this.primero == null) {
            console.log("lista vacia")
            return
        }
        let temp = this.primero
        while (temp != null) {
            console.log("DPI: " + temp.dpi + " Usuario: " + temp.nombreUsuario + " Nombre: " + temp.nombreCompleto)
            temp = temp.siguiente
        }
    }
    /**
     * 
     * @returns GRAFICA DE LISTA DE USUARIOS
     */
    graphviz() {
        if (this.primero == null) {
            return // no esta vacia
        }
        this.auxText = "digraph G{\n\n\tlabel=\" LISTA DE USUARIOS \" bgcolor=\"skyblue2\";\n\t\n"
        this.auxText += "\tedge [arrowsize=0.5];\n\tnode [style = filled ];\n\tranksep = 0.25;\n"

        // DEFINIR NODOS 
        let nodosname = "\t/* NODOS USUARIOS*/\n\tnode [shape = note color =royalblue]\n"
        let temp = this.primero
        nodosname += "\t\"LISTA USUARIOS\" -> " + temp.node + " ;\n"
        while (temp != null) {
            let label = "\"Nombre Usuario: " + temp.nombreCompleto + "\\nDPI: " + temp.dpi + " \""
            nodosname += "\t" + temp.node + " [label =" + label + " ] ;\n"
            temp = temp.siguiente
        }
        // RELANODOS
        let nodosrela = "\t/* RELACIONES NODOS */\n\tedge [arrowhead = lbox]\n"
        temp = this.primero
        while (temp.siguiente != null) {
            nodosrela += "\t" + temp.node + " -> " + temp.siguiente.node + "  ;\n"
            temp = temp.siguiente
        }


        /// unir datos

        this.auxText += nodosname
        this.auxText += nodosrela
        //.width("100%")
        //.height("500")

        /*d3.select("#res")
            .graphviz()
            .zoom(false)
            .renderDot(this.auxText + "\n}")
        */
        return this.auxText + "\n}"
    }

}


/////////////////////////////////////////////// 
/**
 *                                                      LISTA DE LISTAS (HASH TABLE)
*/
///////////////////////////////////////////////

class NodoRep {
    constructor(idCategoria, company) {
        this.idCategoria = idCategoria
        this.company = company
        this.siguiente = null
    }
}
class Rep {
    constructor() {
        this.primero = null
        this.ultimo = null
    }
    getNode(idCategoria) {
        let temp = this.primero
        while (temp != null) {
            if (temp.idCategoria == idCategoria) {
                return temp
            }
            temp = temp.siguiente
        }
        return null
    }
    insertar(idCategoria, company) {
        let nuevo = new NodoRep(idCategoria, company)
        if (this.primero == null) {
            this.primero = nuevo
            this.ultimo = nuevo
            return true
        } else if (this.getNode(idCategoria) == null) {
            this.ultimo.siguiente = nuevo
            this.ultimo = nuevo
            return true
        } else {
            return false
            //repetido
        }
    }
}

class NodoHash {
    constructor(id) {
        this.id = id
        this.nodos = new Rep()
        this.siguiente = null
    }
}

class ListaHash {
    constructor() {
        this.primero = null
        this.ultimo = null
        this.size = 0
        this.elements = 0
        this.auxText = ""

    }
    rellenar() {
        for (let index = 0; index < 20; index++) {
            this.insertar(index)
        }
    }

    rellenar2(n) {
        for (let index = 0; index < n; index++) {
            this.insertar(index)
        }
    }
    getNode(id) {
        let temp = this.primero
        while (temp != null) {
            if (temp.id == id) {
                return temp
            }
            temp = temp.siguiente
        }
        return null
    }
    insertar(id) {
        let nuevo = new NodoHash(id)
        if (this.primero == null) {
            this.primero = nuevo
            this.ultimo = nuevo
            this.size++
        } else {
            this.ultimo.siguiente = nuevo
            this.ultimo = nuevo
            this.size++
        }
    }
    agregarNodo(id, idCategoria, company) {
        let hash = this.getNode(id)
        let guardado = hash.nodos.insertar(idCategoria, company)
        if (guardado) {
            this.elements++
        }
        if (this.overfill()) {
            //console.log("overfill en el id: " + id, " idCategoria: " + idCategoria)
            //this.rehashing()
        }
    }

    print() {
        let temp = this.primero
        while (temp != null) {
            console.log("HASH ID: " + temp.id)
            let nod = temp.nodos.primero
            let text = "|"
            while (nod != null) {
                text += "\t" + nod.company + "\t|"
                nod = nod.siguiente
            }
            console.log(text)
            temp = temp.siguiente
        }
    }

    /**
     * CREAR ARCHIVO DOT PARA HASHTABLE CATEGORIAS
     */
    graphviz() {
        if (this.elements < 1) {
            return // no esta vacia
        }
        this.auxText = "digraph G{\n\n\tlabel=\" TABLA HASH CATEGORIAS \" bgcolor=\"azure2\";\n\t\n"
        this.auxText += "\tedge [arrowsize=0.5];\n\tnode [style = filled ];\n\tranksep = 0.25;\n"

        // DEFINIR NODOS HASH_ID    Y HASH_ELEMENT y RANK_SAME 
        let nodoshash = "\t/* NODOS HASH_ID*/\n\tnode [shape = note color =royalblue]\n"
        let nodoselem = "\t/* NODOS ELEMENTS*/\n\tnode [shape = note color =slategray1]\n"
        let ranknodos = "\t/* RANK-SAME NODOS HASH_ID*/\n"
        let hash = this.primero
        while (hash != null) {
            ranknodos += "\t{ rank = same ; H" + hash.id + " ; "       /// rank nodos
            nodoshash += "\tH" + hash.id + " [label = \"Hash: " + hash.id + "\"] ;\n" /// nodos-hash
            let element = hash.nodos.primero
            while (element != null) {
                ranknodos += "E" + element.idCategoria + " ; "
                nodoselem += "\tE" + element.idCategoria + " [label = \"ID: " + element.idCategoria + "\"] ;\n"  // nodos elem
                element = element.siguiente
            }
            ranknodos += " }\n"
            hash = hash.siguiente
        }

        let relahash = "\t/* RELACIONES NODOS HASH_ID*/\n\tedge [arrowhead = lbox]\n"
        hash = this.primero
        while (hash.siguiente != null) {
            relahash += "\tH" + hash.id + " -> H" + hash.siguiente.id + " ;\n"
            hash = hash.siguiente
        }

        let relahashNode = "\t/* RELACIONES ENTRE NODOS ELEMENT*/\n\tedge [arrowhead = odiamond]\n"
        let relahashNode2 = "\t/* RELACIONES NODOS HASH - ELEMENT*/\n\tedge [arrowhead = diamond]\n"
        hash = this.primero
        while (hash != null) {
            let element = hash.nodos.primero
            if (element != null) {
                relahashNode2 += "\tH" + hash.id + " -> E" + element.idCategoria + " ;\n" // rela hash-element
                while (element.siguiente != null) {
                    let actual = "E" + element.idCategoria
                    let siguiente = "E" + element.siguiente.idCategoria
                    relahashNode += "\t" + actual + " -> " + siguiente + " ;\n" /// rela element
                    element = element.siguiente
                }
            }
            hash = hash.siguiente
        }
        /// unir datos

        this.auxText += nodoshash
        this.auxText += nodoselem
        this.auxText += relahashNode
        this.auxText += relahashNode2
        this.auxText += relahash
        this.auxText += ranknodos
        //.width("100%")
        //.height("500")

        /*d3.select("#res")
            .graphviz()
            .zoom(false)
            .renderDot(this.auxText + "\n}")
        */
        return this.auxText + "\n}"
    }

    overfill() {
        let size = 0
        let temp = this.primero
        while (temp != null) {
            if (temp.nodos.primero != null) {
                size++
            }
            temp = temp.siguiente
        }
        if (size > 0.75 * this.size) {
            //console.log("llenos: " + size)
            return true
        }
        return false
    }
    rehashing() {
        let psize = this.size
        for (let index = 0; index < 5; index++) {
            this.insertar(index + psize)
        }
    }

}





/////////////////////////////////////////////// 
/**
 *                                                      ARBOL BINARIO DE BUSQUEDA
*/
///////////////////////////////////////////////

class NodoABB {
    constructor(dni, nombreActor, correo, descripcion) {
        this.dni = dni
        this.nombreActor = nombreActor
        this.correo = correo
        this.descripcion = descripcion

        this.right = null
        this.left = null
    }
}
class ArbolABB {
    constructor() {
        this.root = null
        this.auxText = ""
        this.size = 0
        this.auxNode = null
    }

    getNode(dni) {
        this.auxNode = null
        this._getNode(this.root, dni)
        return this.auxNode
    }
    _getNode(node, value) {
        if (node == null) {
            return
        }
        if (node.dni == value) {
            this.auxNode = node
        }
        this._getNode(node.right, value)
        this._getNode(node.left, value)

    }

    insertar(dni, nombreActor, correo, descripcion) {
        if (this.getNode(dni) == null) {
            let nuevo = new NodoABB(dni, nombreActor, correo, descripcion)

            if (this.root == null) {
                this.root = nuevo
                this.size++
            } else {
                this._insertar(this.root, nuevo)


                this.size++
            }
        }
        //else {ya existe
    }
    // retornar root
    _insertar(nodo, nuevo) {
        if (nuevo.dni < nodo.dni) {
            if (nodo.left == null) {
                nodo.left = nuevo
                this.size++
            } else {
                this._insertar(nodo.left, nuevo)
            }
        } else {
            if (nodo.right == null) {
                nodo.right = nuevo
                this.size++
            } else {
                this._insertar(nodo.right, nuevo)
            }
        }
        //this.update(node)

        //return this.balancear(node)

        /// modificar altura
    }

    /**
     * CREAR ARCHIVO DOT PARA ABB ACTORES
     */
    graphviz() {
        if (this.root == null) {
            console.log("arbol abb vacio")
            console.log(this.size)
            return
        }
        this.auxText = "digraph G{\n\n\tlabel=\" Arbol ABB Actores \" bgcolor=\"lavenderblush2\";\n"
        this.auxText += "\tsplines=false;\tedge [ arrowsize=0.5];\n\tnode [style=filled,color=\".7 .3 1.0\" shape=ellipse];\n\tranksep = 0.5;\n"

        this.auxText += "\t/* DATOS DEL ARBOL ABB*/\n"
        this.auxText += "\t/* DATOS DE LOS NODOS */\n"
        this.datosHojas(this.root)
        this.auxText += "\t/* DATOS DE LAS RELACIONES */\n"
        this.datosRela(this.root)

        //console.log(this.auxText)
        /*d3.select("#resabb")
            .graphviz()
            .zoom(false)
            .renderDot(this.auxText + "\n}")
        */
        //this.printAll()
        return this.auxText + "\n}"
    }
    datosHojas(node) {
        if (node == null) { return }
        this.auxText += "\tN" + node.dni + " [label = \" " + node.nombreActor + " \\n " + node.dni + " \"]; \n"
        this.datosHojas(node.left)
        this.datosHojas(node.right)
    }
    datosRela(node) {
        if (node == null) { return }
        if (node.left != null) { this.auxText += "\tN" + node.dni + " -> N" + node.left.dni + " [label =\"L\"]\n" }
        if (node.right != null) { this.auxText += "\tN" + node.dni + " -> N" + node.right.dni + " [label =\"R\"]\n" }
        this.datosRela(node.left)
        this.datosRela(node.right)
    }



    printAll() {
        this.auxText = " DATOS INORDER\n"
        this.printInOrder(this.root)
        this.auxText += "\nDATOS PREORDER\n"
        this.printPreOrder(this.root)
        this.auxText += "\nDATOS POSTORDER\n"
        this.printPostOrder(this.root)
        //console.log("suma " + this.auxInt)
        this.auxText += "\nDATOS INORDER REVESA\n"
        this.printInOrderReversa(this.root)
        console.log(this.auxText)
    }
    printInOrder(nodo) {
        if (nodo != null) {
            this.printInOrder(nodo.left)
            this.auxText += " " + nodo.dni
            this.printInOrder(nodo.right)
        }
    }
    printPreOrder(nodo) {
        if (nodo != null) {
            this.auxText += " " + nodo.dni
            this.printPreOrder(nodo.left)
            this.printPreOrder(nodo.right)
        }
    }
    printPostOrder(nodo, actual) {
        if (nodo != null) {
            this.printPostOrder(nodo.left)
            this.printPostOrder(nodo.right)
            this.auxText += " " + nodo.dni
        }
    }


    printInOrderReversa(nodo) {
        if (nodo != null) {
            this.printInOrder(nodo.right)
            this.auxText += " " + nodo.dni
            this.printInOrder(nodo.left)
        }
    }

}



///////////////////////////////////////////////
///////////////////////////////////////////////
/**
 *                                                      ARBOL AVL
 */
///////////////////////////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////


class NodoAvl {
    constructor(idPelicula, nombrePelicula, descripcion, puntuacion, precio) {
        //this.value = value

        this.idPelicula = idPelicula
        this.nombrePelicula = nombrePelicula
        this.descripcion = descripcion
        this.puntuacion = puntuacion
        this.precio = precio
        this.disponible = true

        this.comentarios = []
        this.left = null
        this.right = null
        this.altura = 0
    }

    agregarComentario(user, comentario) {
        this.comentarios.push([user, comentario])
    }

    /**
     * 
     * @returns PELICULA DISPONIBLE?
     */
    getDisponible() {
        return this.disponible
    }

    setDisponible(bolean) {
        this.disponible = bolean
    }
}

class ArbolAvl {
    constructor() {
        this.root = null
        this.size = 0
        this.auxNode = null
        this.auxText = ""
        this.auxBoo = false
    }

    getNode(id) {
        this.auxNode = null
        this._getNode(this.root, id)
        return this.auxNode
    }
    _getNode(node, id) {
        if (node != null) {
            if (node.idPelicula == id) {
                this.auxNode = node
            } else {
                this._getNode(node.left, id)
                this._getNode(node.right, id)
            }
        }
    }

    MAX(a, b) {
        return (a > b) ? a : b
    }
    altura(node) {
        return (node == null) ? -1 : node.altura
    }

    insertar(idPelicula, nombrePelicula, descripcion, puntuacion, precio) {
        let nuevo = new NodoAvl(idPelicula, nombrePelicula, descripcion, puntuacion, precio)
        this.root = this._insertar(this.root, nuevo)
    }
    _insertar(node, nuevo) {
        if (node == null) { return nuevo }
        if (nuevo.idPelicula < node.idPelicula) {
            node.left = this._insertar(node.left, nuevo)
            if (this.altura(node.right) - this.altura(node.left) == -2) {
                if (nuevo.idPelicula < node.left.idPelicula) {
                    node = this.rotIzq(node)
                } else {
                    node = this.rotDIzq(node)
                }
            }
        } else if (nuevo.idPelicula > node.idPelicula) {
            node.right = this._insertar(node.right, nuevo)
            if (this.altura(node.right) - this.altura(node.left) == 2) {
                if (nuevo.idPelicula > node.right.idPelicula) {
                    node = this.rotDer(node)
                } else {
                    node = this.rotDDer(node)
                }
            }
        } else {
            //repetido
            console.log("rep " + nuevo.idPelicula)
            //node.value = value
        }
        node.altura = this.MAX(this.altura(node.left), this.altura(node.right)) + 1
        return node
    }

    rotIzq(node) {
        let temp = node.left
        node.left = temp.right
        temp.right = node
        node.altura = this.MAX(this.altura(node.right), this.altura(node.left)) + 1
        temp.altura = this.MAX(this.altura(node.left), node.altura) + 1
        return temp;
    }
    rotDIzq(node) {
        node.left = this.rotDer(node.left)
        return this.rotIzq(node)
    }
    rotDer(node) {
        let temp = node.right
        node.right = temp.left
        temp.left = node
        node.altura = this.MAX(this.altura(node.right), this.altura(node.left)) + 1
        temp.altura = this.MAX(this.altura(node.right), node.altura) + 1
        return temp


    }
    rotDDer(node) {
        node.right = this.rotIzq(node.right)
        return this.rotDer(node)
    }


    /**
     * CREAR ARCHIVO DOT PARA LA AVL PELICULAS
     */
    graphviz() {
        if (this.root == null) {
            console.log("arbol avl vacio")
            return
        }
        this.auxText = "digraph G{\n\n\tlabel=\" Arbol AVL PELICULAS\" bgcolor=\"lavenderblush2\";\n"
        this.auxText += "\tsplines=false;\tedge [ arrowsize=0.5];\n\tnode [style=filled,color=\".7 .3 1.0\" shape=ellipse];\n\tranksep = 0.5;\n"

        this.auxText += "\t/* DATOS DEL ARBOL ABB*/"
        this.auxText += "\t/* DATOS DE LOS NODOS */\n"
        this.datosHojas(this.root)
        this.auxText += "\t/* DATOS DE LAS RELACIONES */\n"
        this.datosRela(this.root)
        //console.log(this.auxText)
        //.width(1000)
        //.height(500)
        /*
        d3.select("#resavl")
            .graphviz()
            .width("100%")
            .zoom(false)
            .renderDot(this.auxText + "\n}")
        console.log("PELICULAS")
        this.printAll()
        */
        return this.auxText + "\n}"
    }
    datosHojas(node) {
        if (node == null) { return }
        this.auxText += "\tN" + node.idPelicula + " [label = \" " + node.nombrePelicula + "\\n" + node.idPelicula + " \"]; \n"
        this.datosHojas(node.left)
        this.datosHojas(node.right)
    }
    datosRela(node) {
        if (node == null) { return }
        if (node.left != null) { this.auxText += "\tN" + node.idPelicula + " -> N" + node.left.idPelicula + " [label =\"L\"]\n" }
        if (node.right != null) { this.auxText += "\tN" + node.idPelicula + " -> N" + node.right.idPelicula + " [label =\"R\"]\n" }
        this.datosRela(node.left)
        this.datosRela(node.right)
    }

    printAll() {
        this.auxText = " DATOS INORDER\n"
        this.printInOrder(this.root)
        this.auxText += "\nDATOS PREORDER\n"
        this.printPreOrder(this.root)
        this.auxText += "\nDATOS POSTORDER\n"
        this.printPostOrder(this.root)
        //console.log("suma " + this.auxInt)
        this.auxText += "\nDATOS EXAMEN\n"
        //this.printPostOrder2(this.root)
        console.log(this.auxText)
    }
    printInOrder(nodo) {
        if (nodo != null) {
            this.printInOrder(nodo.left)
            this.auxText += " " + nodo.idPelicula
            this.printInOrder(nodo.right)
        }
    }
    printPreOrder(nodo) {
        if (nodo != null) {
            this.auxText += " " + nodo.idPelicula
            this.printPreOrder(nodo.left)
            this.printPreOrder(nodo.right)
        }
    }
    printPostOrder(nodo, actual) {
        if (nodo != null) {
            this.printPostOrder(nodo.left)
            this.printPostOrder(nodo.right)
            this.auxText += " " + nodo.idPelicula
        }
    }
}



///////////////////////////////////////////////
///////////////////////////////////////////////
/**
 *                                                      LISTA DE ALQUILERES
 */
///////////////////////////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////

class NodoRenta {
    constructor(nombre_movie) {
        this.nombre = nombre_movie
        //this.movie = movie
        this.siguiente = null
    }
    toString() {
        return this.nombre +""
    }
}

class ListaRenta {
    constructor() {
        this.primero = null
        this.ultimo = null
        this.len = 0
    }
    insertar(nombre) {
        let nuevo = new NodoRenta(nombre)
        if (this.primero == null) {
            this.primero = nuevo
            this.ultimo = nuevo
            this.len++
        } else {
            this.ultimo.siguiente = nuevo
            this.ultimo = nuevo
            this.len++
        }
    }
}







///////////////////////////////////////////////
///////////////////////////////////////////////
/**
 *                                                      ARBOL MERKLE
 */
///////////////////////////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////

class mNode {
    constructor(data, id) {
        this.data = data

        this.data2 = ""

        this.nodeG = "N" + id
        this.left = null
        this.right = null
    }
}

class MerkleTree {
    constructor() {
        this.root = null
        this.dataBlock = null
        this.currentBlock = null
        this.id = 0
        this.auxText=""
    }

    _filldataBlock() {
        // potencia grado 2 , mayor que los elementos
        let n = 1
        let potencia = Math.pow(2, n)
        while (potencia < this.dataBlock.len) {
            n++
            potencia = Math.pow(2, n)
        }
        // rellenar datablock
        for (let index = this.dataBlock.len; index < potencia; index++) {
            this.dataBlock.insertar(index*100)
        }
        return n
    }

    /**
     * 
     * @param {ListaRenta} list lista de peliculas rentadas
     */
    generarArbol(list){
        this.dataBlock = list
        this.currentBlock = this.dataBlock.primero

        let exp = this._filldataBlock()
        this.root = new mNode(null,this.id++)

        this._generarArbol(this.root,exp)
        this._generarHash(this.root)

    }

    _generarArbol(node,exp){
        // por preorden
        if(exp >0){
            node.left = new mNode(null,this.id++)
            node.right = new mNode(null,this.id++)
            this._generarArbol(node.left,exp-1)
            this._generarArbol(node.right,exp-1)
        }else{
            //llenar los ultimos con los hash de las rentas
            node.data = Sha256.hash(this.currentBlock.toString())
            node.data2 = this.currentBlock.toString()

            this.currentBlock = this.currentBlock.siguiente
        }
    }

    _generarHash(node){
        // por postorden
        if(node == null){
            return
        }
        this._generarHash(node.left)
        this._generarHash(node.right)

        // verificar si data existe
        if(!node.data){
            node.data = Sha256.hash(node.left.data +node.right.data)
        }
    }
    /**
     * 
     * @returns GRAFICA DE ARBOL MERKLE
     */
    graphviz(){
        if(this.root == null){
            console.log("Arbol merkle vacio")
            return 
        }
        
        this.auxText = "digraph G{\n\n\tlabel=\" Arbol MERKLE\" bgcolor=\"lavenderblush2\";\n"
        this.auxText += "\tsplines=false;\tedge [ arrowsize=0.5];\n\tnode [style=filled,color=\".7 .3 1.0\" shape=underline];\n\tranksep = 0.5;\n"

        this.auxText += "\t/* DATOS DEL ARBOL MERKLE*/"
        this.auxText += "\t/* DATOS DE LOS NODOS */\n"
        this.datosHojas(this.root,"R")
        this.auxText += "\t/* DATOS DE LAS RELACIONES */\n"
        this.datosRela(this.root,"R")
        return this.auxText + "\n}"

    }

    datosHojas(node,id) {
        if (node == null) { return }

        this.auxText += "\t" + id + " [label = \" " + node.data + " \"]; \n"

        if(node.data2 != ""){
            this.auxText += "\tNombre" + id + " [label = \" " + node.data2 + " \"]; \n"
        }
        this.datosHojas(node.left,id+"L")
        this.datosHojas(node.right,id+"R")
    }
    datosRela(node,id) {
        if (node == null) { return }
        if (node.left != null) { this.auxText += "\t" + id + " -> " + id + "L [dir =back]\n" }
        if (node.right != null) { this.auxText += "\t" + id + " -> " + id + "R [dir =back]\n" }
        if(node.data2 != ""){
            this.auxText += "\t" + id + " -> Nombre" + id + " \n"
        }
        this.datosRela(node.left,id+"L")
        this.datosRela(node.right,id+"R")
    }
}





class nodoAccion {
    constructor(accion) {
        this.accion = accion
        this.siguiente = null
    }
}

class datosAccion {
    constructor() {
        this.primero = null
        this.ultimo = null
    }
    insertar(accion) {
        let nuevo = new nodoAccion(accion)
        if (this.primero == null) {
            this.primero = nuevo
            this.ultimo = nuevo
        } else {
            this.ultimo.siguiente = nuevo
            this.ultimo = nuevo
        }
    }
}

/// nodos finales
class dataNode {
    constructor(value, timestamp, data, nonce) { // agregar todo
        this.value = value
        this.timestamp = timestamp
        this.data = data//nameuser+namepeli Recurrente
        this.nonce = nonce
        this.siguiente = null
    }
}
class dataNodeList {
    constructor() {
        this.primero = null
        this.ultimo = null
        this.length = 0
    }
    /**
     * 
     * @param {dataNode} datanode ultimo arbol 
     */
    insertar(datanode) {
        if (this.primero == null) {
            this.primero = datanode
            this.ultimo = dataNode
            this.length++
        } else {
            this.ultimo.siguiente = datanode
            this.ultimo = datanode
            this.length++
        }
    }

    getNodePos(index) {
        console.log("index: " + index + " size: " + this.length)
        let id = 0
        let temp = this.primero
        while (temp != null) {
            if (id == index) {
                return temp
            }
            id++
            temp = temp.siguiente
        }
        return null
    }
}

class hashNodeM {
    constructor(hash) {
        this.hash = hash
        this.left = null
        this.right = null
    }
}

class Merkle {
    constructor() {
        this.tophash = null
        this.dataBlock = new dataNodeList()
        this.auxText = ""
        this.index = 0
    }

    add(value) {
        let nuevo = new dataNode(value, "time", "data" + value, "non")
        this.dataBlock.insertar(nuevo)
    }

    createTree(exp) {
        this.tophash = new hashNodeM(0)
        this._createTree(this.tophash, exp)
    }
    _createTree(tmp, exp) {
        if (exp > 0) {
            tmp.left = new hashNodeM(0)
            tmp.right = new hashNodeM(0)
            this._createTree(tmp.left, exp - 1)
            this._createTree(tmp.right, exp - 1)
        }
    }


    genHash(tmp, n, index) { // postorder
        if (tmp != null) {
            this.genHash(tmp.left, n, index)
            this.genHash(tmp.right, n, index)

            if (tmp.left == null && tmp.right == null) {
                tmp.left = this.dataBlock.getNodePos(n - index--)//[n - index--]
                tmp.hash = (tmp.left.value * 1000).toString(16)
            } else {
                tmp.hash = (parseInt(tmp.left.hash, 16) + parseInt(tmp.right.hash, 16)).toString(16) // hash256
            }
        }
    }

    /** LOG MERKLE TREE DATA */
    preorder(tmp) {
        if (tmp != null) {
            if (tmp instanceof dataNode) {
                document.getElementById("log").innerHTML += 'DB:' + tmp.value + "_" + tmp.data + ' '
            } else {
                document.getElementById("log").innerHTML += tmp.hash + ' '
            }
            this.preorder(tmp.left)
            this.preorder(tmp.right)
        }
    }


    auth(index) {
        //this.index = 0
        var exp = 1
        while (Math.pow(2, exp) < this.dataBlock.length) {
            exp += 1
        }
        for (var i = this.dataBlock.length; i < Math.pow(2, exp); i++) {
            this.dataBlock.insertar(new dataNode(i * 100, "time", "data", "noce")) // (new DataNode(i * 100))
        }
        index = Math.pow(2, exp)
        this.createTree(exp)
        this.genHash(this.tophash, Math.pow(2, exp), index)
        this.preorder(this.tophash)
    }

    show() {
        //this.datablock.forEach(element => document.getElementById("log").innerHTML += element.value + ' ');
        let temp = this.dataBlock.primero
        while (temp != null) {
            document.getElementById("log").innerHTML += temp.value + "_" + temp.data + '\t'
            temp = temp.siguiente
        }
    }


    dotfile(tmp) {
        if (tmp != null) {
            if (tmp.left != null) {
                if (tmp.left instanceof dataNode) {
                    this.auxText += '"' + tmp.left.value + '"  -> "0x' + tmp.hash + '" [color=gray] ;\n'
                }
            }
            if (tmp.left instanceof hashNodeM) {
                if (tmp.left != null) this.auxText += '"0x' + tmp.left.hash + '" -> "0x' + tmp.hash + '";\n'
                if (tmp.right != null) this.auxText += '"0x' + tmp.right.hash + '" -> "0x' + tmp.hash + '";\n'
            }
            this.dotfile(tmp.left)
            this.dotfile(tmp.right)
        }
    }

}








///////////////////////////////////////////////
///////////////////////////////////////////////
/**
 *                                                      SHA256
 */
///////////////////////////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  SHA-256 implementation in JavaScript | (c) Chris Veness 2002-2010 | www.movable-type.co.uk    */
/*   - see http://csrc.nist.gov/groups/ST/toolkit/secure_hashing.html                             */
/*         http://csrc.nist.gov/groups/ST/toolkit/examples.html                                   */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

var Sha256 = {};  // Sha256 namespace

/**
 * Generates SHA-256 hash of string
 *
 * @param {String} msg                String to be hashed
 * @param {Boolean} [utf8encode=true] Encode msg as UTF-8 before generating hash
 * @returns {String}                  Hash of msg as hex character string
 */
Sha256.hash = function (msg, utf8encode) {
    utf8encode = (typeof utf8encode == 'undefined') ? true : utf8encode;

    // convert string to UTF-8, as SHA only deals with byte-streams
    if (utf8encode) msg = Utf8.encode(msg);

    // constants [§4.2.2]
    var K = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
    // initial hash value [§5.3.1]
    var H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];

    // PREPROCESSING 

    msg += String.fromCharCode(0x80);  // add trailing '1' bit (+ 0's padding) to string [§5.1.1]

    // convert string msg into 512-bit/16-integer blocks arrays of ints [§5.2.1]
    var l = msg.length / 4 + 2;  // length (in 32-bit integers) of msg + ‘1’ + appended length
    var N = Math.ceil(l / 16);   // number of 16-integer-blocks required to hold 'l' ints
    var M = new Array(N);

    for (var i = 0; i < N; i++) {
        M[i] = new Array(16);
        for (var j = 0; j < 16; j++) {  // encode 4 chars per integer, big-endian encoding
            M[i][j] = (msg.charCodeAt(i * 64 + j * 4) << 24) | (msg.charCodeAt(i * 64 + j * 4 + 1) << 16) |
                (msg.charCodeAt(i * 64 + j * 4 + 2) << 8) | (msg.charCodeAt(i * 64 + j * 4 + 3));
        } // note running off the end of msg is ok 'cos bitwise ops on NaN return 0
    }
    // add length (in bits) into final pair of 32-bit integers (big-endian) [§5.1.1]
    // note: most significant word would be (len-1)*8 >>> 32, but since JS converts
    // bitwise-op args to 32 bits, we need to simulate this by arithmetic operators
    M[N - 1][14] = ((msg.length - 1) * 8) / Math.pow(2, 32); M[N - 1][14] = Math.floor(M[N - 1][14])
    M[N - 1][15] = ((msg.length - 1) * 8) & 0xffffffff;


    // HASH COMPUTATION [§6.1.2]

    var W = new Array(64); var a, b, c, d, e, f, g, h;
    for (var i = 0; i < N; i++) {

        // 1 - prepare message schedule 'W'
        for (var t = 0; t < 16; t++) W[t] = M[i][t];
        for (var t = 16; t < 64; t++) W[t] = (Sha256.sigma1(W[t - 2]) + W[t - 7] + Sha256.sigma0(W[t - 15]) + W[t - 16]) & 0xffffffff;

        // 2 - initialise working variables a, b, c, d, e, f, g, h with previous hash value
        a = H[0]; b = H[1]; c = H[2]; d = H[3]; e = H[4]; f = H[5]; g = H[6]; h = H[7];

        // 3 - main loop (note 'addition modulo 2^32')
        for (var t = 0; t < 64; t++) {
            var T1 = h + Sha256.Sigma1(e) + Sha256.Ch(e, f, g) + K[t] + W[t];
            var T2 = Sha256.Sigma0(a) + Sha256.Maj(a, b, c);
            h = g;
            g = f;
            f = e;
            e = (d + T1) & 0xffffffff;
            d = c;
            c = b;
            b = a;
            a = (T1 + T2) & 0xffffffff;
        }
        // 4 - compute the new intermediate hash value (note 'addition modulo 2^32')
        H[0] = (H[0] + a) & 0xffffffff;
        H[1] = (H[1] + b) & 0xffffffff;
        H[2] = (H[2] + c) & 0xffffffff;
        H[3] = (H[3] + d) & 0xffffffff;
        H[4] = (H[4] + e) & 0xffffffff;
        H[5] = (H[5] + f) & 0xffffffff;
        H[6] = (H[6] + g) & 0xffffffff;
        H[7] = (H[7] + h) & 0xffffffff;
    }

    return Sha256.toHexStr(H[0]) + Sha256.toHexStr(H[1]) + Sha256.toHexStr(H[2]) + Sha256.toHexStr(H[3]) +
        Sha256.toHexStr(H[4]) + Sha256.toHexStr(H[5]) + Sha256.toHexStr(H[6]) + Sha256.toHexStr(H[7]);
}

Sha256.ROTR = function (n, x) { return (x >>> n) | (x << (32 - n)); }
Sha256.Sigma0 = function (x) { return Sha256.ROTR(2, x) ^ Sha256.ROTR(13, x) ^ Sha256.ROTR(22, x); }
Sha256.Sigma1 = function (x) { return Sha256.ROTR(6, x) ^ Sha256.ROTR(11, x) ^ Sha256.ROTR(25, x); }
Sha256.sigma0 = function (x) { return Sha256.ROTR(7, x) ^ Sha256.ROTR(18, x) ^ (x >>> 3); }
Sha256.sigma1 = function (x) { return Sha256.ROTR(17, x) ^ Sha256.ROTR(19, x) ^ (x >>> 10); }
Sha256.Ch = function (x, y, z) { return (x & y) ^ (~x & z); }
Sha256.Maj = function (x, y, z) { return (x & y) ^ (x & z) ^ (y & z); }

//
// hexadecimal representation of a number 
//   (note toString(16) is implementation-dependant, and  
//   in IE returns signed numbers when used on full words)
//
Sha256.toHexStr = function (n) {
    var s = "", v;
    for (var i = 7; i >= 0; i--) { v = (n >>> (i * 4)) & 0xf; s += v.toString(16); }
    return s;
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Utf8 class: encode / decode between multi-byte Unicode characters and UTF-8 multiple          */
/*              single-byte character encoding (c) Chris Veness 2002-2010                         */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

var Utf8 = {};  // Utf8 namespace

/**
 * Encode multi-byte Unicode string into utf-8 multiple single-byte characters 
 * (BMP / basic multilingual plane only)
 *
 * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars
 *
 * @param {String} strUni Unicode string to be encoded as UTF-8
 * @returns {String} encoded string
 */
Utf8.encode = function (strUni) {
    // use regular expressions & String.replace callback function for better efficiency 
    // than procedural approaches
    var strUtf = strUni.replace(
        /[\u0080-\u07ff]/g,  // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
        function (c) {
            var cc = c.charCodeAt(0);
            return String.fromCharCode(0xc0 | cc >> 6, 0x80 | cc & 0x3f);
        }
    );
    strUtf = strUtf.replace(
        /[\u0800-\uffff]/g,  // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
        function (c) {
            var cc = c.charCodeAt(0);
            return String.fromCharCode(0xe0 | cc >> 12, 0x80 | cc >> 6 & 0x3F, 0x80 | cc & 0x3f);
        }
    );
    return strUtf;
}

/**
 * Decode utf-8 encoded string back into multi-byte Unicode characters
 *
 * @param {String} strUtf UTF-8 string to be decoded back to Unicode
 * @returns {String} decoded string
 */
Utf8.decode = function (strUtf) {
    // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
    var strUni = strUtf.replace(
        /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,  // 3-byte chars
        function (c) {  // (note parentheses for precence)
            var cc = ((c.charCodeAt(0) & 0x0f) << 12) | ((c.charCodeAt(1) & 0x3f) << 6) | (c.charCodeAt(2) & 0x3f);
            return String.fromCharCode(cc);
        }
    );
    strUni = strUni.replace(
        /[\u00c0-\u00df][\u0080-\u00bf]/g,                 // 2-byte chars
        function (c) {  // (note parentheses for precence)
            var cc = (c.charCodeAt(0) & 0x1f) << 6 | c.charCodeAt(1) & 0x3f;
            return String.fromCharCode(cc);
        }
    );
    return strUni;
}





/**
 * @param {list} obj lista de atributos a verificar
 * @param {Object} userObj objeto actual 
 * @returns Todos existen?
 */
function allCateg(obj, userObj) {
    return obj.every(name =>
        userObj.hasOwnProperty(name)
    );
}

//testtrees()



export { ArbolABB, ArbolAvl, ListaHash, NodoUser, ListaUsers, Merkle, ListaRenta ,MerkleTree};//,ArbolAvl,ListaHash,ListaUsers