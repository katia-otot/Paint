class Pen {
    constructor(canvas, color = '#000000', size = 2) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.color = color;
        this.size = size;
        this.tool = 'pencil'; // Default tool
        this.drawing = false;
        this.util = new Util(canvas);
        this.history = [];
        this.initEvents();
    }

    // Guardar el estado actual del canvas
    saveState() {
        this.history.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
    }

    // Deshacer el último cambio
    undo() {
        if (this.history.length > 0) {
            let lastState = this.history.pop();
            this.ctx.putImageData(lastState, 0, 0);
        }
    }

    clearCanvas() {
        this.util.clearCanvas();  // Limpia el canvas
    }

    // Inicializa los eventos de dibujo
    initEvents() {
        this.canvas.addEventListener('mousedown', (e) => {
            this.saveState(); // Guardar estado antes de comenzar a dibujar
            this.startDrawing(e);
        });
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
    }

    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;    // Relación entre tamaño lógico y físico en el eje X
        const scaleY = this.canvas.height / rect.height;  // Relación entre tamaño lógico y físico en el eje Y
        return {
            x: (e.clientX - rect.left) * scaleX,          // Ajustar por la escala
            y: (e.clientY - rect.top) * scaleY            // Ajustar por la escala
        };
    }

    startDrawing(e) {
        this.drawing = true;
        this.ctx.beginPath();
        const pos = this.getMousePos(e); // Obtener posición ajustada
        this.ctx.moveTo(pos.x, pos.y);
    }

    stopDrawing() {
        this.drawing = false;
        this.ctx.beginPath();
    }

    draw(e) {
        if (!this.drawing) return;
        const pos = this.getMousePos(e);
        this.ctx.lineWidth = this.size;
        this.ctx.lineCap = 'round';
        this.ctx.strokeStyle = this.tool === 'eraser' ? 'white' : this.color;
        this.ctx.lineTo(pos.x, pos.y);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(pos.x, pos.y);
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
