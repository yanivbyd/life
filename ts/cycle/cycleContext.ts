import { Cell } from "../cell";
import { Creature } from "../creature";
import { GameRules } from "../rules/gameRules";
import { World } from "../world";

export class CycleContext {
    world: World;
    creature: Creature;
    cell: Cell;
    x: number;
    y: number;

    rules: GameRules;
}