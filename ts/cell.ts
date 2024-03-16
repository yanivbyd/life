import { Creature } from './creature.js';
import { Killer } from './killer.js';
import { randomInt } from './utils/random.js';
import { inRange } from './utils/utils.js';
import { World } from './world.js';
import { globalParams } from './worldParams.js';
import {checkChance} from "./utils/random.js";

export class Cell {
    veg: number;
    maxVeg: number;
    vegIncPerCycle: number;
    isWater: boolean;

    creature: Creature;
    killer: Killer;
    playedCycle: number;

    constructor() {
        this.veg = 0;
        this.maxVeg = 0;
        this.vegIncPerCycle = 0;
        this.creature = null;
        this.playedCycle = -1;
        this.isWater = false;
    }

    cycle(world: World): void {
        if (this.playedCycle >= world.currentCycle) return;
        this.playedCycle = world.currentCycle;
        this.veg = inRange(this.veg + Math.max(0, this.vegIncPerCycle), 0, this.maxVeg);
    }

    updateVegInc(amount: number) {
        this.vegIncPerCycle = inRange(this.vegIncPerCycle + amount, 3, 20);
        this.maxVeg = inRange(this.vegIncPerCycle * 3, 0, 30);
        this.veg = inRange(this.veg, 0, this.maxVeg);
    }
}
