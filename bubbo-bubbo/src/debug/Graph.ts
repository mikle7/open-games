const width = 100;
const height = 50;

export class Graph
{
    public canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    constructor()
    {
        const canvas = document.createElement('canvas');

        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d')!;

        
        this.context = context;
    
        context.fillStyle = '#141414';
        context.fillRect(0, 0, width, height);

        context.fillStyle = '#141414';
        context.fillRect(0, 0, width - 1, height);

        context.fillStyle = '#E72264';
        context.fillRect(width - 1, 0, 1, height);

        this.canvas = canvas;
    }

    public update(value:number)
    {
     
        const context = this.context;

        // copy th eprevious canvas along..
        context.drawImage(this.canvas, 0, 0, width, height, -1, 0, width, height);


        context.fillStyle = '#141414';
        context.fillRect(width - 1, 0, width - 1, height);

        const val = (1 - value) * height;

        context.fillStyle = '#E72264';
        context.fillRect(width - 1, val, 1, height - val);
    }
}
