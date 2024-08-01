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

    let grosorLinea = 20

    canvas.width = 800;
    canvas.height = 600;

    // Obtiene la posición del mouse en relación con el canvas
    const getMousePosition = (e) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    const startDrawing = (e) => {
        drawing = true;
        const { x, y } = getMousePosition(e);
        [lastX, lastY] = [x, y];
        draw(e); // Comienza a dibujar inmediatamente en el evento mousedown
    };

    const draw = (e) => {
        if (!drawing) return;
        const { x, y } = getMousePosition(e);

        ctx.lineWidth = grosorLinea;
        ctx.lineCap = 'round';
        ctx.strokeStyle = colorPicker.value;

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();

        [lastX, lastY] = [x, y];

        // Actualizar colores usados
        const color = colorPicker.value;
        let pixelesDibujados = 0
        pixelesDibujados++

        totalDrawingPixels++;
        colorsUsed[color] = (colorsUsed[color] || 0) + pixelesDibujados * 20

        console.log(colorsUsed);
    };

    const stopDrawing = () => drawing = false;

    // Añadir eventos al canvas
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Limpiar el canvas
    clearButton.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        colorsUsed = {};
        totalDrawingPixels = 0;
        result.textContent = '';
    });






    9


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
