import { randomInt } from './random.js';
import { globalParams } from './worldParams.js';

export class Cell {
    vegetation: number;

    constructor() {
        this.vegetation = randomInt(globalParams.minVegetation, globalParams.maxVegetation);
    }
}
