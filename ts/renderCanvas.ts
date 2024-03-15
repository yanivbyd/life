import { World } from './world.js';
import { globalParams } from './worldParams.js';
import { assertEquals } from './utils/assert.js';
import { assertNotNull } from './utils/assert.js';
import { RGB } from './rgb.js';
import { inRange } from './utils/utils.js';

const MAX_RAIN = 20;

export class CanvasRenderer {
    displayCreatures: boolean;
    canvas: Object;
    width: number;
    height: number;
    world: World;
    vegRgbValues: RGB[];
    rainRgbValues: RGB[];
    maxVegForRgbValue: number;

    constructor(canvas: Object, world: World) {
        this.canvas = canvas;
        this.world = world;
        this.width = Math.floor($(canvas).width());
        this.height = Math.floor($(canvas).height());
        this.maxVegForRgbValue = 0;
        this.displayCreatures = true;
        this._initVegColors();
        this._initRainColors();

        assertEquals(this.width, this.world.width);
        assertEquals(this.height, this.world.height);
    }

    toggleDisplay(): boolean {
        this.displayCreatures = !this.displayCreatures;
        this.render();
        return this.displayCreatures;
    }
    private _initVegColors() {
        const startColor: RGB = new RGB(255, 255, 255);
        const endColor: RGB = new RGB(38, 255, 0);
        const maxVeg: number = globalParams.env.maxVeg;
        if (this.maxVegForRgbValue == maxVeg) return;
        this.maxVegForRgbValue = maxVeg;

        this.vegRgbValues = [];
        for (let i=0;i<=maxVeg;i++) {
            this.vegRgbValues.push({
                red: this._relativeVal(startColor.red, endColor.red, maxVeg, i),
                green: this._relativeVal(startColor.green, endColor.green, maxVeg, i),
                blue: this._relativeVal(startColor.blue, endColor.blue, maxVeg, i)
            });
        }
    }

    private _initRainColors() {
        const startColor: RGB = new RGB(255, 255, 255);
        const endColor: RGB = new RGB(38, 255, 0);
        const maxRain: number = MAX_RAIN;

        this.rainRgbValues = [];
        for (let i=0;i<=maxRain;i++) {
            this.rainRgbValues.push({
                red: this._relativeVal(startColor.red, endColor.red, maxRain, i),
                green: this._relativeVal(startColor.green, endColor.green, maxRain, i),
                blue: this._relativeVal(startColor.blue, endColor.blue, maxRain, i)
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
        if (!this.displayCreatures) {
            this.renderRainMap();
            return;
        }
        var ctx = ($(this.canvas)[0] as HTMLCanvasElement).getContext('2d');
        var imageData = ctx.createImageData(this.width, this.height);
        let dataIndex = 0;

        this._initVegColors();

        for (var j = 0; j < this.height; j++) {
            for (var i = 0; i < this.width; i++) {
                var cell = this.world.matrix[i][j];
                var color = this.vegRgbValues[cell.veg];
                if (cell.creature) {
                    color = cell.creature.getTypeDef().color;
                }
                if (cell.killer) {
                    color = new RGB(0, 0, 0);
                }
                assertNotNull(color);
                dataIndex = this._renderPixel(imageData.data, color, dataIndex);
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }

    renderRainMap() {
        var ctx = ($(this.canvas)[0] as HTMLCanvasElement).getContext('2d');
        var imageData = ctx.createImageData(this.width, this.height);
        let dataIndex = 0;

        for (var j = 0; j < this.height; j++) {
            for (var i = 0; i < this.width; i++) {
                var cell = this.world.matrix[i][j];
                var color = this.rainRgbValues[inRange(cell.rain + globalParams.env.extraRain, 0, MAX_RAIN)];
                assertNotNull(color);
                dataIndex = this._renderPixel(imageData.data, color, dataIndex);
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }

}
window['CanvasRenderer'] = CanvasRenderer;
