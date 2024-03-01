import { Creature } from './creature.js';
import { randomInt } from './utils/random.js';
import { globalParams } from './worldParams.js';

export class Cell {
    veg: number;
    rain: number;
    creature: Creature;

    constructor() {
        this.veg = 0;
        this.rain = randomInt(globalParams.env.rain.min, globalParams.env.rain.max);
        this.creature = null;
    }

    cycle(): void {
        this.veg += this.rain;
        this.veg = Math.max(0, Math.min(this.veg, globalParams.env.maxVeg));
    }

    addRain(rainDelta: number) {
        this.rain = Math.max(1, this.rain + rainDelta);
    }
}
