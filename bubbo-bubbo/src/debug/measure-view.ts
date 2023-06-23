import { Graph } from './Graph';
import { measure } from './measure';

class MeasureView
{
    private canvas:HTMLCanvasElement = document.createElement('canvas');

    private domElement:HTMLDivElement = document.createElement('div');
    private measureHash:Record<string, {label:HTMLParagraphElement, graph:Graph}> = {};
    private active = false;
   
    constructor()
    {
        document.body.appendChild(this.domElement);

        this.domElement.style.position = 'absolute';
        this.domElement.style.top = `${50}px`;
        this.domElement.style.right = `${10}px`;
        this.domElement.style.padding = '10px';
        this.domElement.style.width = '100px';
        // align text to left
        
        
        this.domElement.style.backgroundColor = 'rgba(255,255,255,0.5)';

       
        

    }

    public measureNumber(owner:any, value:string, id:string = value)
    {
        if (!this.measureHash[id])
        {
            const measureView =  { label: document.createElement('p'), graph: new Graph(), data: {
                owner, value,
            }};

            this.measureHash[id] = measureView;

            measureView.label.style.font = `bold ${   9  }px Helvetica,Arial,sans-serif`;
    
            this.domElement.appendChild(this.measureHash[id].label);
            this.domElement.appendChild(this.measureHash[id].graph.canvas);
        }

        if(!this.active)
        {
            this.active = true;
            this.update();
        }
    }


    public measureFunction(owner:any, functionName:string, id:string = functionName)
    {
        measure.measureFunction(owner, functionName, id);

        if (!this.measureHash[id])
        {
            const measureView =  { label: document.createElement('p'), graph: new Graph() };

            this.measureHash[id] = measureView;

            measureView.label.style.font = `bold ${   9  }px Helvetica,Arial,sans-serif`;
    
            this.domElement.appendChild(this.measureHash[id].label);
            this.domElement.appendChild(this.measureHash[id].graph.canvas);
        }

        if(!this.active)
        {
            this.active = true;
            this.update();
        }
    }

    private update()
    {
        for (const id in this.measureHash)
        {
            const measureView = this.measureHash[id];

            if(measureView.data)
            {
                measureView.label.innerHTML = `${id}: ${measureView.data.owner[measureView.data.value]}`;
                measureView.graph.update(measureView.data.owner[measureView.data.value] ? 1 : 0);
            }
            else if(measure.measureShouldSample(id))
            {
                measureView.label.innerHTML = `${id}: ${measure.measureGetAverage(id)}`;
                measureView.graph.update(measure.measureGetAverage(id) * 0.8);
            }
            
        }

        requestAnimationFrame(()=>
        {
            this.update();
        });
    }
}

export const measureView = new MeasureView();