class HistoryManager {
    constructor(util) {
        this.util = util; // Usar util en lugar de acceder directamente al canvas
        this.history = [];
        this.undoLimit = 50;
    }

    saveState() {
        const ctx = this.util.getCtx(); // Obtener el contexto desde Util
        const canvas = this.util.getCanvas();
        if (this.history.length >= this.undoLimit) {
            this.history.shift();
        }
        const state = ctx.getImageData(0, 0, canvas.width, canvas.height);
        this.history.push(state);
    }

    undo() {
        const ctx = this.util.getCtx(); // Obtener el contexto desde Util
        if (this.history.length > 0) {
            const previousState = this.history.pop();
            ctx.putImageData(previousState, 0, 0);
        }
    }
}
