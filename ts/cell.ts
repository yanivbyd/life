import { Creature } from './creature.js';
import { Killer } from './killer.js';
import { randomInt } from './utils/random.js';
import { inRange } from './utils/utils.js';
import { World } from './world.js';
import { globalParams } from './worldParams.js';

export class Cell {
    veg: number;
    rain: number;
    creature: Creature;
    killer: Killer;
    playedCycle: number;

    constructor() {
        this.veg = 0;
        this.rain = 0;
        this.creature = null;
        this.playedCycle = -1;
    }

    cycle(world: World): void {
        if (this.playedCycle >= world.currentCycle) return;
        this.playedCycle = world.currentCycle;

        this.veg += Math.max(0, this.rain + globalParams.env.extraRain);
        this.veg = inRange(this.veg, 0, globalParams.env.maxVeg);
    }

    addRain(rainDelta: number) {
        this.rain = inRange(this.rain + rainDelta, -3, 20);
    }
}
