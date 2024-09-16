class CanvasImage {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.util = new Util(canvas);
        this.originalImageData = null;
    }

    // Cargar una imagen desde el archivo y dibujarla en el canvas
    loadImage(file) {
        const reader = new FileReader();
        const img = new Image();
        reader.onload = (e) => {
            img.onload = () => {
                this.canvas.width = img.width;
                this.canvas.height = img.height;
                this.util.clearCanvas(); // Limpiar canvas antes de dibujar la nueva imagen
                this.util.getCtx().drawImage(img, 0, 0);
                this.originalImageData = this.util.getCanvasData(); // Guardar imagen original
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
