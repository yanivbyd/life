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
        const nextPos: Pos = this._findPosToMove(ctx);
        const movePenalty: number = ctx.penalties.moving.calc(ctx.creature.dna.size);
        const breathPenalty: number = ctx.penalties.breathing.calc(ctx.creature.dna.size);
        if (nextPos && ctx.creature.health > movePenalty) {
            if (checkChance(this.def.chance)) {
                ctx.moveCreatureTo(nextPos.x, nextPos.y);
                ctx.creature.reduceHealth(movePenalty, ctx);
                ctx.statsCounter.tick('move', ctx.creature.type);
            }
        }
    }

    private _findPosToMove(ctx: CycleContext): Pos {
        let options: Pos[] = ctx.world.getNeighbouringPositions(ctx.x, ctx.y)
            .filter(n => !ctx.world.matrix[n.x][n.y].creature);
        return getRandomArrItem(options);
    }

}