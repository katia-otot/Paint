// Inicialización del canvas y clases
const canvas = document.getElementById('canvas');
const util = new Util(canvas);
const historyManager = new HistoryManager(util);
const pen = new Pen(canvas, util, historyManager);
const img = new CanvasImage(canvas, util, historyManager);


let lastBrightnessValue = 0;  // Para almacenar el último valor de brillo
// Eventos de botones
document.getElementById('clearBtn').addEventListener('click', () => util.clearCanvas());

document.getElementById('pencilBtn').addEventListener('click', () => pen.setTool('pencil'));
document.getElementById('eraserBtn').addEventListener('click', () => pen.setTool('eraser'));
document.getElementById('colorPicker').addEventListener('input', (e) => pen.setColor(e.target.value));
document.getElementById('loadImage').addEventListener('change', (e) => img.loadImage(e.target.files[0]));
document.getElementById('saveBtn').addEventListener('click', () => img.saveImage());
document.getElementById('sizeRange').addEventListener('input', (e) => {pen.setSize(e.target.value);});
document.getElementById('undoBtn').addEventListener('click', () => {pen.undo();});
document.getElementById('undoBtn').addEventListener('click', () => {historyManager.undo();});

// Filtros
document.getElementById('negativeBtn').addEventListener('click', () => {
    const negativeFilter = new NegativeFilter(canvas);
    negativeFilter.apply();
});

document.getElementById('brightnessSlider').addEventListener('input', (e) => {
    const brightnessValue = parseInt(e.target.value);
    const brightnessFilter = new BrightnessFilter(canvas, brightnessValue);
    brightnessFilter.apply();
});