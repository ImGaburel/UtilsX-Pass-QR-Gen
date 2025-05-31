class QRGenerator {
    constructor() {
        this.qr = null;
        this.canvas = null;
    }

    generate(text, size = 300) {
        if (!text.trim()) {
            throw new Error('El texto no puede estar vacío');
        }

        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
        }

        this.qr = new QRious({
            element: this.canvas,
            value: text,
            size: parseInt(size),
            background: 'white',
            foreground: 'black',
            level: 'H'
        });

        return this.canvas;
    }

    downloadQR(filename = 'qr-code.png') {
        if (!this.canvas) {
            throw new Error('No hay código QR para descargar');
        }

        const link = document.createElement('a');
        link.download = filename;
        link.href = this.canvas.toDataURL('image/png');
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}