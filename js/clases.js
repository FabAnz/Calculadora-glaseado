class Sistema {
    historialTrazos = new Array()
    coloresContados = {}
    coloresSeleccionados = new Array()

    //Verificar que un color ya haya sido seleccionado
    colorExiste(color) {
        for (let unColor of this.coloresSeleccionados) {
            if (color == unColor) return true
        }
        return false
    }

    //Borrar de coloresSeleccionados los que ya no aparecen en el canva
    borrarSeleccionados() {
        for (let i = 0; i < this.coloresSeleccionados.length; i++) {
            let unColor = this.coloresSeleccionados[i]

            if (!this.coloresContados[unColor]) this.coloresSeleccionados.splice(i, 1)
        }
    }

}

let sistema = new Sistema()

