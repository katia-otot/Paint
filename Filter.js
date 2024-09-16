
class Filter {
    constructor(canvas) {
        this.canvas = canvas;
        this.util = new Util(canvas);
    }

    // Método que será sobrescrito por los filtros específicos
    apply() {
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
        let imageData = this.getImageData();
        let data = imageData.data;

        // Aplicar el filtro negativo
        for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];     // Red
            data[i + 1] = 255 - data[i + 1]; // Green
            data[i + 2] = 255 - data[i + 2]; // Blue
        }
        this.putImageData(imageData);
    }
}

class BrightnessFilter extends Filter {
    constructor(canvas, value, originalImageData) {
        super(canvas);
        this.value = value; // El valor de brillo
        this.originalImageData = originalImageData; // Imagen original
    }

    apply() {
        let imageData = new ImageData(
            new Uint8ClampedArray(this.originalImageData.data), 
            this.originalImageData.width, 
            this.originalImageData.height
        );  // Copia de la imagen original
        let data = imageData.data;

        // Aplicar brillo basado en el valor del slider
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, Math.max(0, data[i] + this.value));     // Red
            data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + this.value)); // Green
            data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + this.value)); // Blue
        }

        this.putImageData(imageData); // Dibujar la imagen con el brillo ajustado
    }
}

// Agregar otros filtros como binarización, sepia, saturación, bordes, blur extendiendo Filter
