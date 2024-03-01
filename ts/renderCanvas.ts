import { World } from './world.js';
import { globalParams } from './worldParams.js';
import { assertEquals } from './utils/assert.js';
import { assertNotNull } from './utils/assert.js';

class RGB {
    red: number;
    green: number;
    blue: number;
}

export class CanvasRenderer {
    canvas: Object;
    width: number;
    height: number;
    world: World;
    vegRgbValues: RGB[];

    constructor(canvas: Object, world: World) {
        this.canvas = canvas;
        this.world = world;
        this.width = $(canvas).width();
        this.height =$(canvas).height();
        this._initVegColors();

        assertEquals(this.width, this.world.width);
        assertEquals(this.height, this.world.height);
    }

    private _initVegColors() {
        const startColor: RGB = { red: 255, green: 255, blue: 255};
        const endColor: RGB = { red: 38, green: 255, blue: 0 };
        const maxVeg = globalParams.env.maxVeg;

        this.vegRgbValues = [];
        for (let i=0;i<=maxVeg;i++) {
            this.vegRgbValues.push({
                red: this._relativeVal(startColor.red, endColor.red, maxVeg, i),
                green: this._relativeVal(startColor.green, endColor.green, maxVeg, i),
                blue: this._relativeVal(startColor.blue, endColor.blue, maxVeg, i)
            });
        }
    }

    private _relativeVal(start: number, end: number, maxVal: number, val: number): number {
        return Math.floor(start + (end-start) * (val/maxVal));
    }

    private _renderPixel(data: any, rgb: RGB, dataIndex: number): number {
        data[dataIndex] = rgb.red;
        data[dataIndex+1] = rgb.green;
        data[dataIndex+2] = rgb.blue;
        data[dataIndex+3] = 255; // alpha
        return dataIndex+4;
    }

    render(): void {
        var ctx = ($(this.canvas)[0] as HTMLCanvasElement).getContext('2d');
        var imageData = ctx.createImageData(this.width, this.height);
        let dataIndex = 0;

        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                var cell = this.world.matrix[i][j];
                const color = this.vegRgbValues[cell.veg];
                assertNotNull(color);
                if (!color) {
                    debugger;
                }
                dataIndex = this._renderPixel(imageData.data, color, dataIndex);
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }

}


window['CanvasRenderer'] = CanvasRenderer;
