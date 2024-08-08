class Sistema {
    history = new Array()
    trazosBorrados = new Array()
}

let sistema = new Sistema()

let contadorIdTrazo = 0
class Trazo {
    constructor(dato, trazo, color) {
        this.id = contadorIdTrazo++
        this.dato = dato
        this.trazo = trazo
        this.color = color
    }
}

let contadorIdBorrado = 0
class TrazoBorrado {
    constructor(valor, color, idTrazo) {
        this.id = contadorIdBorrado++
        this.valor = valor
        this.color = color
        this.idTrazo = idTrazo
    }
}