//Pen.js
class Pen {
    constructor(canvas, util, historyManager) {
        this.canvas = canvas;
        this.util = util; // Usar util para obtener el contexto
        this.historyManager = historyManager; // Usar el historyManager actualizado
        this.color = 'black';
        this.size = 0;
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
        const ctx = this.util.getCtx();
        const pos = this.getMousePos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);


        // Guardar el estado antes de empezar a dibujar (nuevo trazo)
        this.historyManager.saveState();


        this.drawing = true;
    }


    stopDrawing() {
        if (!this.drawing) return;
        this.drawing = false;
        const ctx = this.util.getCtx();
        ctx.closePath();
   
        // Restablecer el modo de composición a su estado predeterminado después de usar la goma
        if (this.tool === 'eraser') {
            ctx.globalCompositeOperation = 'source-over';
        }
    }


    draw(e) {
        if (!this.drawing) return;
        const ctx = this.util.getCtx();
        const pos = this.getMousePos(e);
   
        if (this.tool === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out'; // Modo borrador
            ctx.strokeStyle = 'rgba(0,0,0,1)'; // Color no importa
        } else {
            ctx.globalCompositeOperation = 'source-over'; // Modo dibujo
            ctx.strokeStyle = this.color;
        }
   
        ctx.lineWidth = this.size;
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    }


    // Cambia la herramienta entre lápiz y goma
    setTool(tool) {
        this.tool = tool;
        this.canvas.style.cursor = (tool === 'eraser') ? 'crosshair' : 'default';
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
