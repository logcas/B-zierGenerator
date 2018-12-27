import { Bezier } from './bezier';

let canvas = document.querySelector('#app') as HTMLCanvasElement,
    drawBtn = document.querySelector('#draw') as HTMLButtonElement,
    clearBtn = document.querySelector('#clear') as HTMLButtonElement;

let bezier = new Bezier(canvas);

canvas.onclick = function (e): void {

    let x: number = e.layerX,
        y: number = e.layerY;

    bezier.add({ x, y });

}

drawBtn.onclick = function (): void {

    bezier.draw();

}

clearBtn.onclick = function (): void {

    bezier.clear();

}
