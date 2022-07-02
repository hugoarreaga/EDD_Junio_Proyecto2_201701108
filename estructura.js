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
        this.node = "N"+dpi
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
        nodosname += "\t\"LISTA USUARIOS\" -> "+temp.node +" ;\n"
        while(temp != null){
            let label = "\"Nombre Usuario: " + temp.nombreCompleto + "\\nDPI: " + temp.dpi + " \""
            nodosname += "\t"+temp.node +" [label ="+label+" ] ;\n"
            temp = temp.siguiente
        }
        // RELANODOS
        let nodosrela = "\t/* RELACIONES NODOS */\n\tedge [arrowhead = lbox]\n"
        temp = this.primero
        while(temp.siguiente != null){
            nodosrela += "\t"+temp.node +" -> "+ temp.siguiente.node+"  ;\n"
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
        return this.auxText +"\n}"
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
            console.log("overfill en el id: " + id, " idCategoria: " + idCategoria)
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
        this.auxText = "digraph G{\n\n\tlabel=\" TABLA HASH CATEGORIAS \" bgcolor=\"none\";\n\t\n"
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
            console.log("llenos: " + size)
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
}

class ArbolAvl {
    constructor() {
        this.root = null
        this.size = 0
        this.auxNode = null
        this.auxText = ""
        this.auxBoo = false
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
 *                                                      ARBOL MERKLE
 */
///////////////////////////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////
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















/** 

//llenar usuarios
let usuarios = new ListaUsers()
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
        usuarios.printUsers()
    }
    lector.readAsText(str);
}
document.getElementById("fileUsers").addEventListener('change', fillUsers, false)    /// usuarios


let peliculas = new ArbolAvl()
//llenar peliculas
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
document.getElementById("fileMovies").addEventListener('change', fillMovies, false)    /// peliculas





let actores = new ArbolABB()
//llenar actores
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
document.getElementById("fileActors").addEventListener('change', fillActors, false)    /// actores


let categ = new ListaHash()
categ.rellenar()
//llenar categorias
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
document.getElementById("fileCateg").addEventListener('change', fillCateg, false)    /// categorias




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


function tarea5() {
    let datos = [15, 35, 68, 54, 21, 85, 35, 36, 32, 10, 25, 35, 68, 68, 9, 54, 87]
    let tarea = new ListaHash()
    tarea.rellenar2(30)
    datos.forEach(element => {
        let mod = element % 30
        tarea.agregarNodo(mod, element, "company")
    });

    tarea.graphviz()
}

//tarea5()


export { ArbolABB, ArbolAvl, ListaHash, NodoUser, ListaUsers, Merkle };//,ArbolAvl,ListaHash,ListaUsers