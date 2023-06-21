const sampleSize = 100;

class Measure
{
    private measureHash:Record<string, {
        lastTime: number;start:number, count:number, totalTime:number
}> = {};
    
    public measureFunction(owner:any, functionName:string, id:string = functionName)
    {
        const functionOriginal = owner[functionName];
        
        if (!this.measureHash[id])
        {
            this.measureHash[id] = { start: 0, count: 0, totalTime: 0 };
        }


        owner[functionName] = (...args:any[])=>
        {
            this.measureBegin(id);

            const result = functionOriginal.call(owner, ...args);

            this.measureEnd(id);

            return result;
        };
        
       
    }

    public  measureBegin(id:string)
    {
        this.measureHash[id].start = performance.now();
    }

    public measureEnd(id:string)
    {
        const measure = this.measureHash[id];

        
        if(measure.count > sampleSize)
        {
            measure.totalTime = 0;
    
            measure.count = 0;
        }

        measure.lastTime = performance.now() - measure.start;
        
        measure.totalTime += measure.lastTime;
        measure.count++;
    }

    public measureGetAverage(id:string)
    {
        const measure = this.measureHash[id];

        // round to 3 decimal places

        return Math.round((measure.totalTime / measure.count) * 1000) / 1000;

       
    }

    public measureShouldSample(id:string)
    {
        const measure = this.measureHash[id];

        // round to 3 decimal places

        return measure.count >= sampleSize;
    }


    public measureGetLast(id:string)
    {
        const measure = this.measureHash[id];

        // round to 3 decimal places

        return Math.round(measure.lastTime * 1000) / 1000;
    }
}

export const measure = new Measure();