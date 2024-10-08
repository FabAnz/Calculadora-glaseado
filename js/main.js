//Constantes
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const clearButton = document.getElementById('clearButton');
const showPercentagesButton = document.getElementById('showPercentagesButton');
const result = document.getElementById('result');
const pincel = document.querySelector("#rgPincel");

// Añadir eventos al canvas
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Añadir eventos al canvas para dispositivos táctiles
canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('touchcancel', stopDrawing);

//Borrar todo
clearButton.addEventListener("click", borrarTodo)


let drawing = false;
let lastX = 0, lastY = 0;

/* Variables de historial de trazos */
let historyIndex = -1;

canvas.width = 500;
canvas.height = 600;


//Color picker
let color = colorPicker.value;
colorPicker.addEventListener("input", function () {
    color = colorPicker.value
    if (color == "#000000") color = "#000001"
})


// Controlar el grosor del pincel
let grosorLinea = pincel.value;
pincel.addEventListener("input", function () {
    grosorLinea = pincel.value;
});


/* Guardar el estado del canva cuando se va a realizar un nuevo trazo */
function saveState() {
    if (historyIndex < sistema.historialTrazos.length - 1) {
        // Si estamos en el medio del historial, descarta los estados posteriores
        sistema.historialTrazos = sistema.historialTrazos.slice(0, historyIndex + 1);
    }
    sistema.historialTrazos.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
    historyIndex++;
}

// Agregar evento al botón de deshacer
document.getElementById('btnDeshacer').addEventListener('click', undo);

/* Deshacer trazo */
function undo() {
    if (historyIndex >= 0) {

        ctx.putImageData(sistema.historialTrazos[historyIndex], 0, 0);
        sistema.historialTrazos.pop()

        historyIndex--;
        contarPixelesPorColor()

        sistema.borrarSeleccionados()
        calcularPorcentajes()
    }
}

// Inicializar estado de los píxeles con el color actual
let pixelsState = Array.from({ length: canvas.width }, () => Array(canvas.height).fill(null));

// Obtiene la posición del puntero (mouse o touch) en relación con el canvas
function getPointerPosition(e) {
    const rect = canvas.getBoundingClientRect();
    if (e.touches) {
        return {
            x: e.touches[0].clientX - rect.left,
            y: e.touches[0].clientY - rect.top
        };
    } else {
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
}

function startDrawing(e) {
    e.preventDefault(); // Prevent default behavior for touch events
    drawing = true;
    const { x, y } = getPointerPosition(e);
    [lastX, lastY] = [x, y];

    saveState();
    if (!sistema.colorExiste(color)) sistema.coloresSeleccionados.push(color)

    draw(e); // Comienza a dibujar inmediatamente en el evento mousedown/touchstart
}

function draw(e) {
    if (!drawing) return;

    const { x, y } = getPointerPosition(e);

    ctx.lineWidth = grosorLinea;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    [lastX, lastY] = [x, y];
}

//Termina el trazo
function stopDrawing() {
    if (drawing) {
        drawing = false;

        contarPixelesPorColor()
        calcularPorcentajes()
    }
}

//Contar los pixeles para sacar porcentajes de uso
function contarPixelesPorColor() {
    // Obtener la información de los píxeles del canvas
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    sistema.coloresContados = {}
    // Recorrer todos los píxeles del canvas
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];       // Componente Rojo
        const g = data[i + 1];   // Componente Verde
        const b = data[i + 2];   // Componente Azul

        // Convertir los componentes RGB a formato hexadecimal
        const hexColor = rgbToHex(r, g, b);

        if (sistema.colorExiste(hexColor)) {
            // Incrementar la cuenta para el color encontrado
            if (sistema.coloresContados[hexColor]) {
                sistema.coloresContados[hexColor]++;
            } else {
                sistema.coloresContados[hexColor] = 1;
            }
        }
    }
}

// Función auxiliar para convertir RGB a hexadecimal
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

// Convertir un componente (R, G o B) a formato hexadecimal
function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}


// Limpiar el canvas
function borrarTodo() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sistema.coloresContados = {}
    sistema.coloresSeleccionados = []
    sistema.historialTrazos = []
    historyIndex = -1


    pixelsState = Array.from({ length: canvas.width }, () => Array(canvas.height).fill(null)); // Reiniciar estado de los píxeles
    result.textContent = '';
    calcularPorcentajes()
}

//Calcular porcentajes
function calcularPorcentajes() {
    let totalPixeles = 0
    let porcentaje = 0
    let id = ""
    let colores = ""

    result.innerHTML = ""
    //Contar todos los pixeles
    for (let pixel of Object.values(sistema.coloresContados)) {
        totalPixeles += pixel
    }

    for (let unColor in sistema.coloresContados) {
        porcentaje = sistema.coloresContados[unColor] / totalPixeles * 100
        id = unColor.slice(1)
        colores += `<div id="muestraColor${id}" class="muestraColor"></div> ${porcentaje.toFixed(0)}% `
    }
    result.innerHTML = colores

    //Cambiar colores
    for (let unColor in sistema.coloresContados) {
        id = unColor.slice(1)
        document.querySelector(`#muestraColor${id}`).style.backgroundColor = unColor
    }
}