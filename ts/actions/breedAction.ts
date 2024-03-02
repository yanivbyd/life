import { Cell } from "../cell.js";
import { CreatureAction } from "../creatureAction.js";
import { CycleContext } from "../cycle/cycleContext.js";
import { Pos } from "../pos.js";
import { getRandomArrItem } from "../utils/random.js";
import {chance} from "../utils/random.js";

export class BreedDef {
    chance: number;
    minHealth: number;
}

export class BreedAction implements CreatureAction {
    def: BreedDef;

    constructor(def: BreedDef) {
        this.def = def;
    }
    cycle(ctx: CycleContext): void {
    }


}