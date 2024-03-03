import { Cell } from "../cell.js";
import { CreatureAction } from "../creatureAction.js";
import { CycleContext } from "../cycle/cycleContext.js";
import { Pos } from "../pos.js";
import { getRandomArrItem } from "../utils/random.js";
import { checkChance } from "../utils/random.js";

export class MoveDef {
    chance: number;
    minVegAmount: number;
}

export class MoveAction implements CreatureAction {
    def: MoveDef;

    constructor(def: MoveDef) {
        this.def = def;
    }
    cycle(ctx: CycleContext): void {
        if (ctx.cell.veg >= this.def.minVegAmount) return;
        const nextPos: Pos = this._findNeighbourWithMaxVeg(ctx);
        const movePenalty: number = ctx.penalties.moving.calc(ctx.creature.size);
        const breathPenalty: number = ctx.penalties.breathing.calc(ctx.creature.size);
        if (nextPos && ctx.creature.health > movePenalty + breathPenalty) {
            if (checkChance(this.def.chance)) {
                ctx.moveCreatureTo(nextPos.x, nextPos.y);
                ctx.creature.reduceHealth(movePenalty, ctx);
                ctx.statsCounter.tick('move', ctx.creature.type);
            }
        }
    }

    private _findNeighbourWithMaxVeg(ctx: CycleContext): Pos {
        let options: Pos[] = [];
        let neighbours: Pos[] = ctx.world.getNeighbouringPositions(ctx.x, ctx.y);
        let maxVeg = -1;
        for (var i=0;i<neighbours.length;i++) {
            const cell: Cell = ctx.world.matrix[neighbours[i].x][neighbours[i].y];
            if (!cell.creature) {
                if (cell.veg == maxVeg) {
                    options.push(neighbours[i]);
                } else if (cell.veg > maxVeg) {
                    options = [neighbours[i]];
                    maxVeg = cell.veg;
                }
            }
        }
        return getRandomArrItem(options);
    }

}