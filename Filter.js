
class Filter {
    constructor(canvas) {
        this.canvas = canvas;
        this.util = new Util(canvas);
        this.historyManager = historyManager;
    }

    // Método que será sobrescrito por los filtros específicos
    apply() {
        this.historyManager.saveState(); // Guardar estado antes de aplicar el filtro
        throw new Error('El método apply() debe ser implementado en las subclases');
    }

    getImageData() {
        return this.util.getCanvasData();
    }

    putImageData(imageData) {
        this.util.updateCanvasData(imageData);
    }
}

class NegativeFilter extends Filter {
    apply() {
        this.historyManager.saveState(); // Guardar el estado antes de aplicar el filtro
        let imageData = this.getImageData();
        let data = imageData.data;

        // Aplicar el filtro negativo
        for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];     // Red
            data[i + 1] = 255 - data[i + 1]; // Green
            data[i + 2] = 255 - data[i + 2]; // Blue
        }

        this.putImageData(imageData); // Actualizar el canvas con el nuevo filtro
    }
}

class BrightnessFilter extends Filter {
    constructor(canvas, value) {
        super(canvas);
        this.value = value;  // El valor inicial del brillo
        this.originalImageData = null;  // Se guardará al aplicar el filtro por primera vez
    }

    apply() {
        // Guardar el estado actual del canvas antes de aplicar el filtro
        // Esto es necesario para que deshacer funcione correctamente.
        this.historyManager.saveState(); 

        // Si la imagen original no ha sido guardada aún, la guardamos
        if (!this.originalImageData) {
            this.originalImageData = this.getImageData(); // Guarda la imagen original al aplicar el filtro por primera vez
        }

        // Crear una copia de la imagen original
        let imageData = new ImageData(
            new Uint8ClampedArray(this.originalImageData.data),
            this.originalImageData.width,
            this.originalImageData.height
        );

        let data = imageData.data;

        // Aplicar el brillo basado en el valor actual
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, Math.max(0, data[i] + this.value));     // Red
            data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + this.value)); // Green
            data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + this.value)); // Blue
        }

        this.putImageData(imageData); // Dibujar la imagen con el brillo ajustado
    }

    updateValue(value) {
        this.value = value;  // Actualiza el valor del brillo
        this.apply();        // Aplica el brillo sobre la imagen original
    }
    
}

// Agregar otros filtros como binarización, sepia, saturación, bordes, blur extendiendo Filter
