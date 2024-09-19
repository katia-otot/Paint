class Pen {
    constructor(canvas, color = '#000000', size = 2) {
        this.canvas = canvas;
        this.util = util; // Usar util para obtener el contexto
        this.historyManager = historyManager; // Usar el historyManager actualizado
        this.color = '#000000';
        this.size = 2;
        this.tool = 'pencil';
        this.drawing = false;
        this.initEvents();
    }

    clearCanvas() {
        this.util.clearCanvas();  // Limpia el canvas
    }

    // Inicializa los eventos de dibujo
    initEvents() {
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
    }

    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) * (this.canvas.width / rect.width),
        y: (e.clientY - rect.top) * (this.canvas.height / rect.height)
        };
    }

    startDrawing(e) {
        this.historyManager.saveState(); // Guardar el estado antes de dibujar
        this.drawing = true;
        const ctx = this.util.getCtx(); // Obtener el contexto desde Util
        ctx.beginPath();
        const pos = this.getMousePos(e);
        ctx.moveTo(pos.x, pos.y);
    }

    stopDrawing() {
        if (!this.drawing) return;
        this.drawing = false;
        const ctx = this.util.getCtx(); // Obtener el contexto desde Util
        ctx.closePath();
    }

    draw(e) {
        if (!this.drawing) return;
        const ctx = this.util.getCtx(); // Obtener el contexto desde Util
        const pos = this.getMousePos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.size;
        ctx.stroke();
    }

    // Cambia la herramienta entre lápiz y goma
    setTool(tool) {
        this.tool = tool;
    }

    // Cambia el color del lápiz
    setColor(color) {
        this.color = color;
    }

    // Cambia el tamaño del lápiz
    setSize(size) {
        this.size = size;
    }
}
