//HistoryManager.js
class HistoryManager {
    constructor(util) {
        this.util = util;
        this.history = [];
        this.undoLimit = 10;
    }


    saveState() {
        const ctx = this.util.getCtx();
        const canvas = this.util.getCanvas();
        if (this.history.length >= this.undoLimit) {
            this.history.shift(); // Limitar el historial para mantener solo los últimos 'undoLimit' estados
        }
   
        // Guardar el estado actual del canvas
        const currentState = {
            imageData: ctx.getImageData(0, 0, canvas.width, canvas.height),
        };
        this.history.push(currentState); // Añadir el nuevo estado al historial    
    }


    undo() {
        if (this.history.length > 0) {
            let previousState = this.history.pop();
            if (previousState) {
                this.util.getCtx().putImageData(previousState.imageData, 0, 0);
             }
             
             
        }
    }
}









