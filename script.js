//script.js
// Inicialización del canvas y clases
const canvas = document.getElementById('canvas');
const util = new Util(canvas);
const historyManager = new HistoryManager(util);
const pen = new Pen(canvas, util, historyManager);
const img = new CanvasImage(canvas, util, historyManager);
const brightnessFilter = new BrightnessFilter(canvas, 0);
const saturationFilter = new SaturationFilter(canvas, 1); // Valor inicial
const edgeDetectionFilter = new EdgeDetectionFilter(canvas);
let blurFilter;
let lastBrightnessValue = 0;  // Para almacenar el último valor de brillo


// Eventos de botones
document.getElementById('clearBtn').addEventListener('click', () => {
    util.clearCanvas();
    // Reiniciar los datos originales en todos los filtros
    brightnessFilter.resetOriginalImageData();
    saturationFilter.resetOriginalImageData();
    edgeDetectionFilter.resetOriginalImageData();
});

document.getElementById('pencilBtn').addEventListener('click', () => pen.setTool('pencil'));
document.getElementById('eraserBtn').addEventListener('click', () => pen.setTool('eraser'));
document.getElementById('colorPicker').addEventListener('input', (e) => pen.setColor(e.target.value));

document.getElementById('loadImage').addEventListener('change', (e) => {
    img.loadImage(e.target.files[0]);
    // Reiniciar los datos originales en todos los filtros
    brightnessFilter.resetOriginalImageData();
    saturationFilter.resetOriginalImageData();
    edgeDetectionFilter.resetOriginalImageData();
});

document.getElementById('saveBtn').addEventListener('click', () => img.saveImage());
document.getElementById('sizeRange').addEventListener('input', (e) => {pen.setSize(e.target.value);});


document.getElementById('undoBtn').addEventListener('click', () => {
    historyManager.undo(); // Restaurar el estado anterior (incluye canvas y brillo)
    util.getCtx().globalCompositeOperation = 'source-over';
});



// Filtros
document.getElementById('negativeBtn').addEventListener('click', () => {
    const negativeFilter = new NegativeFilter(canvas);
    negativeFilter.apply();
});


document.getElementById('brightnessSlider').addEventListener('input', (e) => {
    const brightnessValue = parseInt(e.target.value);
    brightnessFilter.updateValue(brightnessValue); // Guardar el estado actual del canvas antes de aplicar el filtro, incluyendo el brillo actual
    
});

document.getElementById('binarizationBtn').addEventListener('click', () => {
    const binarizationFilter = new BinarizationFilter(canvas);
    binarizationFilter.apply();
});


document.getElementById('sepiaBtn').addEventListener('click', () => {
    const sepiaFilter = new SepiaFilter(canvas);
    sepiaFilter.apply();
});


document.getElementById('saturationInput').addEventListener('input', (e) => {
    const saturationValue = parseFloat(e.target.value); // Obtener el valor de saturación del slider
    saturationFilter.updateValue(saturationValue);      // Aplicar la saturación actualizada
});

document.getElementById('edgeDetectionBtn').addEventListener('click', () => {
    edgeDetectionFilter.apply();
});

document.getElementById('blurBtn').addEventListener('click', () => {
    blurFilter = new BlurFilter(canvas);
    blurFilter.apply();
});

