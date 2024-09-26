//Filter.js
class Filter {
    constructor(canvas) {
        this.canvas = canvas;
        this.util = new Util(canvas);
        this.historyManager = historyManager;
        this.originalImageData = null; 
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

    // Método para reiniciar los datos de la imagen original
    resetOriginalImageData() {
        this.originalImageData = null;
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

class BinarizationFilter extends Filter {
    apply() {
        this.historyManager.saveState(); // Guardar el estado antes de aplicar el filtro
        let imageData = this.getImageData();
        let data = imageData.data;

        // Aplicar el filtro de binarización
        for (let i = 0; i < data.length; i += 4) {
            // Calcular el promedio de los valores RGB
            let grayscale = (data[i] + data[i + 1] + data[i + 2]) / 3;

            // Binarización: si el promedio es mayor que 128, se hace blanco, si no, se hace negro
            let value = grayscale > 128 ? 255 : 0;

            data[i] = value;       // Red
            data[i + 1] = value;   // Green
            data[i + 2] = value;   // Blue
        }

        this.putImageData(imageData); // Actualizar el canvas con la imagen binarizada
    }
}


class SepiaFilter extends Filter {
    apply() {
        // Guardar el estado actual antes de aplicar el filtro
        this.historyManager.saveState();
        
        // Obtener los datos actuales del canvas
        let imageData = this.getImageData();
        let data = imageData.data;

        // Aplicar el filtro sepia
        for (let i = 0; i < data.length; i += 4) {
            let red = data[i];
            let green = data[i + 1];
            let blue = data[i + 2];

            // Fórmulas para aplicar el efecto sepia
            data[i]     = Math.min(255, red * 0.393 + green * 0.769 + blue * 0.189);  // Red
            data[i + 1] = Math.min(255, red * 0.349 + green * 0.686 + blue * 0.168);  // Green
            data[i + 2] = Math.min(255, red * 0.272 + green * 0.534 + blue * 0.131);  // Blue
        }

        // Actualizar el canvas con los nuevos datos
        this.putImageData(imageData);
    }
}

class SaturationFilter extends Filter {
    constructor(canvas, value) {
        super(canvas);
        this.value = value;  // El valor inicial de saturación
        this.originalImageData = null;  // Guardamos la imagen original al aplicar el filtro por primera vez
    }

    apply() {
        this.historyManager.saveState(); // Guardar el estado antes de aplicar el filtro

        if (!this.originalImageData) {
            this.originalImageData = this.getImageData(); // Guardar la imagen original
        }

        let imageData = new ImageData(
            new Uint8ClampedArray(this.originalImageData.data),
            this.originalImageData.width,
            this.originalImageData.height
        );

        let data = imageData.data;

        // Aplicar la saturación a la imagen
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // Convertir a escala de grises
            const gray = 0.3 * r + 0.59 * g + 0.11 * b;

            // Ajustar los canales RGB basado en el valor de saturación
            data[i] = gray + (r - gray) * this.value;     // Red
            data[i + 1] = gray + (g - gray) * this.value; // Green
            data[i + 2] = gray + (b - gray) * this.value; // Blue
        }

        this.putImageData(imageData); // Dibujar la imagen con la saturación ajustada
    }

    updateValue(value) {
        this.value = value;  // Actualiza el valor de la saturación
        this.apply();        // Aplica la saturación sobre la imagen original
    }
}

class EdgeDetectionFilter extends Filter {
    constructor(canvas) {
        super(canvas);
    }

    apply() {
        this.historyManager.saveState();  // Guardar el estado antes de aplicar el filtro
        
        // Si la imagen original no ha sido guardada aún, la guardamos
        if (!this.originalImageData) {
            this.originalImageData = this.getImageData();  // Guardar la imagen original
        }

        let imageData = new ImageData(
            new Uint8ClampedArray(this.originalImageData.data),
            this.originalImageData.width,
            this.originalImageData.height
        );

        let data = imageData.data;
        let width = imageData.width;
        let height = imageData.height;

        // Kernel de detección de bordes
        const kernel = [
            -1, -1, -1,
            -1,  8, -1,
            -1, -1, -1
        ];

        const side = Math.sqrt(kernel.length);
        const halfSide = Math.floor(side / 2);

        const srcData = this.originalImageData.data;
        const output = new Uint8ClampedArray(srcData.length);

        // Recorrer cada píxel de la imagen
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let r = 0, g = 0, b = 0;

                // Aplicar la convolución con el kernel
                for (let ky = -halfSide; ky <= halfSide; ky++) {
                    for (let kx = -halfSide; kx <= halfSide; kx++) {
                        const posY = y + ky;
                        const posX = x + kx;

                        // Asegurarse de que las coordenadas están dentro de la imagen
                        if (posY >= 0 && posY < height && posX >= 0 && posX < width) {
                            const pos = (posY * width + posX) * 4;
                            const weight = kernel[(ky + halfSide) * side + (kx + halfSide)];

                            r += srcData[pos] * weight;
                            g += srcData[pos + 1] * weight;
                            b += srcData[pos + 2] * weight;
                        }
                    }
                }

                const index = (y * width + x) * 4;
                // Ajustar los colores a los rangos válidos [0, 255]
                output[index] = Math.min(Math.max(r, 0), 255);
                output[index + 1] = Math.min(Math.max(g, 0), 255);
                output[index + 2] = Math.min(Math.max(b, 0), 255);
                output[index + 3] = 255;  // Mantener la opacidad
            }
        }

        // Colocar los datos procesados de nuevo en el canvas
        for (let i = 0; i < data.length; i++) {
            data[i] = output[i];
        }

        this.putImageData(imageData);  // Dibujar la imagen con los bordes detectados
    }
}

class BlurFilter extends Filter {
    constructor(canvas, kernelType = 'box') {
        super(canvas);
        this.kernel = kernelType === 'gaussian' ? this.getGaussianKernel() : this.getBoxKernel();
        this.kernelSize = this.kernel.length;
        this.offset = Math.floor(this.kernelSize / 2);
    }

    getBoxKernel() {
        return [
            [1 / 9, 1 / 9, 1 / 9],
            [1 / 9, 1 / 9, 1 / 9],
            [1 / 9, 1 / 9, 1 / 9]
        ];
    }

    getGaussianKernel() {
        return [
            [1 / 256, 4 / 256, 6 / 256, 4 / 256, 1 / 256],
            [4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256],
            [6 / 256, 24 / 256, 36 / 256, 24 / 256, 6 / 256],
            [4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256],
            [1 / 256, 4 / 256, 6 / 256, 4 / 256, 1 / 256]
        ];
    }

    apply() {
        this.historyManager.saveState();  // Guardar el estado antes de aplicar el filtro

        let imageData = this.getImageData();
        let data = imageData.data;
        let width = imageData.width;
        let height = imageData.height;

        let outputData = new Uint8ClampedArray(data.length);

        // Recorrer cada píxel de la imagen
        for (let x = this.offset; x < width - this.offset; x++) {
            for (let y = this.offset; y < height - this.offset; y++) {
                let acc = [0, 0, 0];  // Acumuladores para R, G, B

                // Aplicar la convolución con el kernel
                for (let a = 0; a < this.kernelSize; a++) {
                    for (let b = 0; b < this.kernelSize; b++) {
                        const xn = x + a - this.offset;
                        const yn = y + b - this.offset;

                        const index = (yn * width + xn) * 4;
                        const weight = this.kernel[a][b];

                        acc[0] += data[index] * weight;      // R
                        acc[1] += data[index + 1] * weight;  // G
                        acc[2] += data[index + 2] * weight;  // B
                    }
                }

                const outputIndex = (y * width + x) * 4;
                // Asignar los nuevos valores RGB ajustados
                outputData[outputIndex] = acc[0];
                outputData[outputIndex + 1] = acc[1];
                outputData[outputIndex + 2] = acc[2];
                outputData[outputIndex + 3] = data[outputIndex + 3];  // Mantener la opacidad
            }
        }

        // Colocar los datos procesados de nuevo en el canvas
        for (let i = 0; i < data.length; i++) {
            data[i] = outputData[i];
        }

        this.putImageData(imageData);  // Dibujar la imagen con el filtro aplicado
    }
}




