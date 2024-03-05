import { Cell } from "../cell.js";
import { Creature } from "../creature.js";
import { CreatureAction } from "../creatureAction.js";
import { CycleContext } from "../cycle/cycleContext.js";
import { Pos } from "../pos.js";
import { getRandomArrItem } from "../utils/random.js";
import { checkChance } from "../utils/random.js";

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
        if (ctx.creature.health < this.def.minHealth) { return; }
        const mate: Creature = this._findBreedMate(ctx);
        const babyPos: Pos = this._findEmptyNeighbourPos(ctx);
        if (!mate || !babyPos) { return; }

        if (checkChance(this.def.chance)) {
            const healthFromMe = Math.floor(ctx.creature.health / 2);
            const healthFromMate = Math.floor(mate.health / 2);
            const babyHealth = healthFromMe + healthFromMate;
            const babyDNA = checkChance(ctx.rules.mutationChance) ? ctx.creature.dna.mutate() : ctx.creature.dna; 
            ctx.createBaby(babyPos, babyHealth, ctx.creature, babyDNA);
            
            ctx.creature.reduceHealth(healthFromMe + ctx.penalties.birth.calc(ctx.creature.size), ctx);
            mate.reduceHealth(healthFromMate + ctx.penalties.birth.calc(mate.size), ctx);
            ctx.statsCounter.tick('birth', ctx.creature.type);
        }
    }

    private _findBreedMate(ctx: CycleContext): Creature {
        let options: Creature[] = [];
        let neighbours: Pos[] = ctx.world.getNeighbouringPositions(ctx.x, ctx.y);
        let maxHealth = this.def.minHealth; // don't select a mate with less than minHealth
        for (var i=0;i<neighbours.length;i++) {
            const cell: Cell = ctx.world.matrix[neighbours[i].x][neighbours[i].y];
            if (cell.creature && cell.creature.type == ctx.creature.type) {
                const mateHealth = cell.creature.health;
                if (mateHealth == maxHealth) {
                    options.push(cell.creature);
                } else if (mateHealth > maxHealth) {
                    options = [cell.creature];
                    maxHealth = mateHealth;
                }
            }
        }
        return getRandomArrItem(options);
    }

    private _findEmptyNeighbourPos(ctx: CycleContext): Pos {
        let options: Pos[] = [];
        let neighbours: Pos[] = ctx.world.getNeighbouringPositions(ctx.x, ctx.y);
        for (var i=0;i<neighbours.length;i++) {
            const cell: Cell = ctx.world.matrix[neighbours[i].x][neighbours[i].y];
            if (!cell.creature) {
                options.push(neighbours[i]);
            }
        }
        return getRandomArrItem(options);
    }

}