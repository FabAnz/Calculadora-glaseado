// script.js
window.onload = function () {
    const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const clearButton = document.getElementById('clearButton');
const showPercentagesButton = document.getElementById('showPercentagesButton');
const result = document.getElementById('result');

let drawing = false;
let lastX = 0, lastY = 0;
let colorsUsed = {};
let totalDrawingPixels = 0;
let grosorLinea = 10;

canvas.width = 800;
canvas.height = 600;

// Inicializar estado de los píxeles
let pixelsState = Array.from({ length: canvas.width }, () => Array(canvas.height).fill(false));

// Obtiene la posición del puntero (mouse o touch) en relación con el canvas
const getPointerPosition = (e) => {
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
};

const startDrawing = (e) => {
    e.preventDefault(); // Prevent default behavior for touch events
    drawing = true;
    const { x, y } = getPointerPosition(e);
    [lastX, lastY] = [x, y];
    draw(e); // Comienza a dibujar inmediatamente en el evento mousedown/touchstart
};

const draw = (e) => {
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
                if (!pixelsState[currentX][currentY]) {
                    pixelsState[currentX][currentY] = true;

                    const color = colorPicker.value;
                    totalDrawingPixels++;
                    colorsUsed[color] = (colorsUsed[color] || 0) + 1;
                }
            }
        }
    }

    [lastX, lastY] = [x, y];

    console.log(colorsUsed);
};

const stopDrawing = () => drawing = false;

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

// Limpiar el canvas
clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    colorsUsed = {};
    totalDrawingPixels = 0;
    pixelsState = Array.from({ length: canvas.width }, () => Array(canvas.height).fill(false)); // Reiniciar estado de los píxeles
    result.textContent = '';
});

    











    showPercentagesButton.addEventListener('click', displayResults);



    function displayResults() {
        const percentages = calculatePercentages();

        let resultado = "<h2>Color Usage Percentages:</h2>"

        for (let color in percentages) {
            resultado += `<p>${color}: ${percentages[color]}%</p>`;
        }
        result.innerHTML = resultado
    }
}
