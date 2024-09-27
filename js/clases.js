class Sistema {
    historialTrazos = new Array()
    coloresContados = {}
    coloresSeleccionados = new Array()
    coloresBorrados = new Array()

    //Verificar que un color ya haya sido seleccionado
    colorExiste(color) {
        for (let unColor of this.coloresSeleccionados) {
            if (color == unColor) return true
        }

        //Aca mismo hacer que se cambie el color de una lista a otra
        for (let i = 0; i < this.coloresBorrados.length; i++) {
            if (color == this.coloresBorrados[i]) {
                this.coloresSeleccionados.push(color)
                this.coloresBorrados.splice(i, 1)
                return true
            }
        }

        return false
    }

    //Borrar de coloresSeleccionados los que ya no aparecen en el canva
    borrarSeleccionados() {
        for (let i = 0; i < this.coloresSeleccionados.length; i++) {
            let unColor = this.coloresSeleccionados[i]

            if (!this.coloresContados[unColor]) {
                this.coloresBorrados.push(unColor)
                this.coloresSeleccionados.splice(i, 1)
            }
        }
    }

    //Restaurar colores borrados que reaparecen al deshacer
    restaurarBorrados() {

    }

}

let sistema = new Sistema()

