import { CreatureAction } from "../creatureAction.js";
import {BreedAction, BreedDef } from "./breedAction.js";
import { EatVegAction } from "./eatVeg.js";
import {MoveAction, MoveDef} from "./moveAction.js";

export class CreatureDNA {
    moveDef: MoveDef;
    breedDef: BreedDef;

    actions: CreatureAction[];

    constructor(moveDef: MoveDef, breedDef: BreedDef) {
        this.moveDef = moveDef;
        this.breedDef = breedDef;
        this.actions = [
            new EatVegAction(),
            new MoveAction(this.moveDef),
            new BreedAction(this.breedDef)
        ]
    }
}