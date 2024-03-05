import { World } from './world.js';
import { randomInt } from './utils/random.js';

export class VegShapes {
    world: World;
    canvas: HTMLCanvasElement;

    constructor(world: World) {
        this.world = world;
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.world.width
        this.canvas.height = this.world.height;
    }

    addShape(rainDeltaFrom: number, rainDeltaTo: number): void {
        let ctx = this.canvas.getContext('2d');
        const width = this.canvas.width;
        const height = this.canvas.height;
        ctx.lineJoin = 'round'
        ctx.lineWidth = 3;
        
        const numberOfShapes = 6;
        for (var s=0;s<numberOfShapes;s++) {
            ctx.clearRect(0, 0, width, height);
            for (var i = 0; i < 4; i++) {
                ctx.beginPath();
                ctx.moveTo(randomInt(5, width - 5), randomInt(5, height - 5));
                for (var i = 0; i < 10; i++) {
                    const x = randomInt(0, width-1);
                    const y = randomInt(0, height-1);
                    ctx.quadraticCurveTo(
                        (x + 30) % width, (y+40) % height,
                        (x + 60) % width, (y+60) % height
                    );
                    // ctx.moveTo(x, y);
                }
            }
            ctx.fillStyle = 'black';
            ctx.closePath();
            ctx.fill();

            for (let i=0; i<=width; i++) {
                for (let j=0; j<=height; j++) {
                    if (this._hasColor(ctx, i, j)) {
                        this.world.matrix[i][j].addRain(randomInt(rainDeltaFrom, rainDeltaTo));
                    }
                }
            }
        }
    }

    private _hasColor(canvasCtx: CanvasRenderingContext2D , x: number, y: number) {
        return canvasCtx.getImageData(x, y, 1, 1).data[3] == 255;
    }

}
