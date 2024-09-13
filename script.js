const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

// Variables de control
let painting = false;
let tool = 'pencil';
let color = '#000000';

// Iniciar dibujo
function startDrawing(e) {
    painting = true;
    draw(e);
}

// Terminar dibujo
function stopDrawing() {
    painting = false;
    ctx.beginPath();
}

// Dibujar según la herramienta seleccionada
function draw(e) {
    if (!painting) return;
    
    ctx.lineWidth = tool === 'eraser' ? 20 : 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = tool === 'eraser' ? 'white' : color;
    
    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
}

// Cambiar color del lápiz
document.getElementById('colorPicker').addEventListener('input', (e) => {
    color = e.target.value;
});

// Seleccionar herramienta lápiz
document.getElementById('pencilBtn').addEventListener('click', () => {
    tool = 'pencil';
});

// Seleccionar goma de borrar
document.getElementById('eraserBtn').addEventListener('click', () => {
    tool = 'eraser';
});

// Limpiar lienzo
document.getElementById('clearBtn').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Cargar imagen desde el disco
document.getElementById('loadImage').addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = event.target.result;
    };
    
    reader.readAsDataURL(file);
});

// Guardar imagen
document.getElementById('saveBtn').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'mi_dibujo.png';
    link.href = canvas.toDataURL();
    link.click();
});

// Filtros

// Filtro: Negativo
document.getElementById('negativeBtn').addEventListener('click', () => {
    applyFilter(pixels => {
        pixels.data.forEach((value, index) => {
            if ((index + 1) % 4 !== 0) { // Skip alpha
                pixels.data[index] = 255 - value; // Invert colors
            }
        });
    });
});

// Filtro: Brillo
document.getElementById('brightnessBtn').addEventListener('click', () => {
    applyFilter(pixels => {
        pixels.data.forEach((value, index) => {
            if ((index + 1) % 4 !== 0) {
                pixels.data[index] = value + 40; // Increase brightness
            }
        });
    });
});

// Aplicar cualquier filtro
function applyFilter(filterFn) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData;
    
    filterFn(pixels);
    
    ctx.putImageData(pixels, 0, 0);
}

// Completar con otros filtros: binarización, sepia, saturación, detección de bordes, blur.

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);
