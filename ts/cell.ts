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
        this.veg += this.rain;
        this.veg = Math.max(0, Math.min(this.veg, globalParams.env.maxVeg));
    }

    addRain(rainDelta: number) {
        this.rain = Math.max(1, this.rain + rainDelta);
    }
}
