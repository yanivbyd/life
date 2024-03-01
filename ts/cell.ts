import { randomInt } from './random.js';
import { globalParams } from './worldParams.js';

export class Cell {
    veg: number;
    rain: number;

    constructor() {
        this.veg = 0;
        this.rain = randomInt(globalParams.env.rain.min, globalParams.env.rain.max);
    }

    cycle(): void {
        this.veg += Math.max(0, Math.min(this.rain, globalParams.env.maxVeg));
    }
}
