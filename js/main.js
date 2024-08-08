// script.js

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
let colorsUsed = {};
let colorPrevio = "";
let valorColorPrevio = 0;
let totalDrawingPixels = 0;

/* Variables de historial de trazos */
let trazo = 0
let image = null
let historyIndex = -1;

canvas.width = 800;
canvas.height = 600;


//Color picker
let color = colorPicker.value;
colorPicker.addEventListener("input", function () {
    color = colorPicker.value
})


// Controlar el grosor del pincel
let grosorLinea = pincel.value;
pincel.addEventListener("input", function () {
    grosorLinea = pincel.value;
});


/* Guardar los trazos nuevos */
function saveState() {
    if (historyIndex < sistema.history.length - 1) {
        // Si estamos en el medio del historial, descarta los estados posteriores
        sistema.history = sistema.history.slice(0, historyIndex + 1);
    }
    image = ctx.getImageData(0, 0, canvas.width, canvas.height);
    historyIndex++;
}

// Agregar evento al botón de deshacer
document.getElementById('btnDeshacer').addEventListener('click', undo);

/* Deshacer trazo */
function undo() {
    if (historyIndex >= 0) {
        ctx.putImageData(sistema.history[historyIndex].dato, 0, 0);

        colorsUsed[sistema.history[historyIndex].color] = colorsUsed[sistema.history[historyIndex].color] - sistema.history[historyIndex].trazo;

        if (colorsUsed[sistema.history[historyIndex].color] == 0) delete colorsUsed[sistema.history[historyIndex].color]
        sistema.history.pop()

        historyIndex--;
        calcularPorcentajes()
        console.log(colorsUsed)
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

    // Guardar el estado al iniciar un trazo
    if (isNaN(colorsUsed[color])) colorsUsed[color] = 0
    trazo = colorsUsed[color]

    saveState();
    draw(e); // Comienza a dibujar inmediatamente en el evento mousedown/touchstart
}

function draw(e) {
    if (!drawing) return;
    const { x, y } = getPointerPosition(e);

    ctx.lineWidth = grosorLinea;
    ctx.lineCap = 'round';
    ctx.strokeStyle = colorPicker.value;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    // Marcar los píxeles en el área de la línea como pintados
    const halfLineWidth = Math.floor(grosorLinea / 2);

    for (let offsetX = -halfLineWidth; offsetX <= halfLineWidth; offsetX++) {
        for (let offsetY = -halfLineWidth; offsetY <= halfLineWidth; offsetY++) {
            const currentX = Math.floor(lastX + offsetX);
            const currentY = Math.floor(lastY + offsetY);

            if (currentX >= 0 && currentX < canvas.width && currentY >= 0 && currentY < canvas.height) {
                let previousColor = pixelsState[currentX][currentY];

                if (previousColor !== color) {
                    // Si hay un color debajo, resta su conteo
                    if (previousColor !== null) {
                        colorsUsed[previousColor]--;
                        valorColorPrevio++;
                        colorPrevio = previousColor
                        if (colorsUsed[previousColor] === 0) {
                            delete colorsUsed[previousColor];
                        }
                    }

                    // Actualiza el nuevo color
                    pixelsState[currentX][currentY] = color;
                    totalDrawingPixels++;
                    colorsUsed[color] = (colorsUsed[color] || 0) + 1;
                }
            }
        }
    }

    [lastX, lastY] = [x, y];
}


//Termina el trazo
function stopDrawing() {
    if (drawing) {
        drawing = false;
        trazo = colorsUsed[color] - trazo;
        let nuevoTrazo = new Trazo(image, trazo, color)
        sistema.history.push(nuevoTrazo)
        //Si se borro un trazo previo este se guarda
        if (valorColorPrevio > 0) {
            let trazoBorrado = new TrazoBorrado(valorColorPrevio, colorPrevio, sistema.history[sistema.history.length - 1].id)

            sistema.trazosBorrados.push(trazoBorrado)
        }

        trazo = 0
        valorColorPrevio = 0
        calcularPorcentajes()
        console.log(sistema.trazosBorrados)
    }
}

// Limpiar el canvas
function borrarTodo() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    colorsUsed = {};
    sistema.history = []
    historyIndex = -1

    totalDrawingPixels = 0;
    pixelsState = Array.from({ length: canvas.width }, () => Array(canvas.height).fill(null)); // Reiniciar estado de los píxeles
    result.textContent = '';
}

//Calcular porcentajes
function calcularPorcentajes() {
    let totalPixeles = 0
    let porcentaje = 0
    let id = ""
    let colores = ""

    result.innerHTML = ""

    for (let trazo of Object.values(colorsUsed)) {
        totalPixeles += trazo
    }

    for (let unColor in colorsUsed) {
        porcentaje = colorsUsed[unColor] / totalPixeles * 100
        id = unColor.slice(1)
        colores += `<div id="muestraColor${id}" class="muestraColor"></div> ${porcentaje.toFixed(0)}% `
    }
    result.innerHTML = colores

    //Cambiar colores
    for (let unColor in colorsUsed) {
        id = unColor.slice(1)
        document.querySelector(`#muestraColor${id}`).style.backgroundColor = unColor
    }
}