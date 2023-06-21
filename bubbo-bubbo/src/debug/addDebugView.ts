import { Renderer } from 'pixi.js';

import { measureView } from './measure-view';
import { Stats } from './Stats';

export function addDebugView(renderer:Renderer)
{
    measureView.measureFunction(renderer, 'render');

    addLabel(renderer);
    addFPS();
}

function addLabel(renderer:Renderer)
{
    const label = document.createElement('div');
    
    label.style.font = `bold ${   9  }px Helvetica,Arial,sans-serif`;
    label.style.position = 'absolute';
    label.style.padding = '10px';
    label.style.backgroundColor = '#FFFFFF';
    label.innerHTML = renderer.type ?? 'webgl-v7';
    
    // position label top right
    label.style.top = `${10}px`;
    label.style.right = `${10}px`;

    document.body.appendChild(label);

}


function addFPS()
{
    const stats = new Stats();

    stats.dom.style.transform = 'scale(3)';
    stats.dom.style.top = `${80}px`;
    stats.dom.style.left = `${100}px`;
    document.body.appendChild(stats.dom);

    function update()
    {

        stats.update();

        requestAnimationFrame(update);
    }
    
    update();

}