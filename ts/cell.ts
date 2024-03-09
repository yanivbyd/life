import { Creature } from './creature.js';
import { randomInt } from './utils/random.js';
import { inRange } from './utils/utils.js';
import { World } from './world.js';
import { globalParams } from './worldParams.js';

export class Cell {
    veg: number;
    rain: number;
    creature: Creature;

    constructor() {
        this.veg = 0;
        this.rain = 0;
        this.creature = null;
    }

    cycle(world: World): void {
        this.veg += (this.rain+globalParams.env.extraRain);
        this.veg = Math.max(0, Math.min(this.veg, globalParams.env.maxVeg));
    }

    addRain(rainDelta: number) {
        this.rain = inRange(this.rain + rainDelta, 0, 20);
    }
}
