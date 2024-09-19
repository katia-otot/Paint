class CanvasImage {
    constructor(canvas) {
        this.canvas = canvas;
        this.util = util;
        this.historyManager = historyManager;
        this.originalImageData = null;
    }

    // Cargar una imagen desde el archivo y dibujarla en el canvas
    loadImage(file) {
        const reader = new FileReader();
        const img = new Image();
        reader.onload = (e) => {
            img.onload = () => {
                this.historyManager.saveState(); // Guardar el estado antes de cargar la imagen
                this.util.clearCanvas();

                const canvasWidth = this.util.getCanvas().width;
                const canvasHeight = this.util.getCanvas().height;

                // Calcular la proporción de la imagen
                const imgWidth = img.width;
                const imgHeight = img.height;
                const widthRatio = canvasWidth / imgWidth;
                const heightRatio = canvasHeight / imgHeight;
                const scaleFactor = Math.min(widthRatio, heightRatio);

                // Redimensionar manteniendo la proporción
                const newWidth = imgWidth * scaleFactor;
                const newHeight = imgHeight * scaleFactor;
                const offsetX = (canvasWidth - newWidth) / 2;  // Centrar horizontalmente
                const offsetY = (canvasHeight - newHeight) / 2; // Centrar verticalmente

                // Dibujar la imagen redimensionada sin distorsión
                this.util.getCtx().drawImage(img, 0, 0, imgWidth, imgHeight, offsetX, offsetY, newWidth, newHeight);
                this.originalImageData = this.util.getCanvasData(); // Guardar la imagen original
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    restoreOriginalImage() {
        if (this.originalImageData) {
            this.util.updateCanvasData(this.originalImageData); // Restaurar la imagen original usando Util
        }
    }

    // Guardar la imagen actual del canvas
    saveImage() {
        const link = document.createElement('a');
        link.download = 'mi_dibujo.png';
        link.href = this.canvas.toDataURL();
        link.click();
    }
}
