import { Cell } from "../cell";
import { Creature } from "../creature";
import { GameRules } from "../rules/gameRules";
import { Penalties } from "../rules/penalties";
import { World } from "../world";

export class CycleContext {
    world: World;
    creature: Creature;
    cell: Cell;
    x: number;
    y: number;

    rules: GameRules;
    penalties: Penalties;

    creatureDied() {
        this.world.matrix[this.x][this.y].creature = null;
    }

}