class Util {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    // Función para limpiar todo el canvas
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
         // Limpiar el valor del input de archivo para permitir cargar la misma imagen
        const imageInput = document.getElementById('loadImage');
        if (imageInput) {
            imageInput.value = ''; // Restablecer el valor del input de archivo
        }
    }

    // Función para obtener los píxeles actuales del canvas
    getCanvasData() {
        return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }

    // Función para actualizar el canvas con nueva información de píxeles
    updateCanvasData(imageData) {
        this.ctx.putImageData(imageData, 0, 0);
    }
    
    getCtx() {
        return this.ctx;
    }
    // Función para ajustar el tamaño del canvas según sea necesario
    resizeCanvas(newWidth, newHeight) {
        this.canvas.width = newWidth;
        this.canvas.height = newHeight;
    }
}
