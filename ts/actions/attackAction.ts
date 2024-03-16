import { Cell } from "../cell.js";
import { Creature } from "../creature.js";
import { CreatureAction } from "../creatureAction.js";
import { CycleContext } from "../cycle/cycleContext.js";
import { Pos } from "../pos.js";
import { assertNotNull } from "../utils/assert.js";
import { getRandomArrItem } from "../utils/random.js";
import { checkChance } from "../utils/random.js";
import { globalParams } from "../worldParams.js";

export class AttackDef {
    chance: number;
}

export class AttackAction implements CreatureAction {
    def: AttackDef;

    constructor(def: AttackDef) {
        this.def = def;
    }
    cycle(ctx: CycleContext): void {
        const attackPenalty: number = ctx.penalties.attack.calc(ctx.creature.dna.size);
        const oppPos: Pos = this._findAttackOpponent(ctx);
        if (!oppPos) return;
        const opp: Creature = ctx.world.matrix[oppPos.x][oppPos.y].creature;
        assertNotNull(opp);

        if (!ctx.creature.dna.eatDef.isWaterCreature && opp.dna.eatDef.isWaterCreature) {
            ctx.creature.incHealth(opp.health );
            opp.reduceHealth(opp.health, ctx);
            ctx.world.matrix[oppPos.x][oppPos.y].creature = null;
            ctx.moveCreatureTo(oppPos.x, oppPos.y);
            ctx.statsCounter.tick('eatFish', ctx.creature.type);
            return;
        }
        if (ctx.creature.dna.eatDef.isWaterCreature && !opp.dna.eatDef.isWaterCreature) {
            // fish can't attack land creatures
            return;
        }

        const sizeDiff = ctx.creature.dna.size - opp.dna.size;
        const attackSuccessChance = globalParams.rules.attackSuccessChange.calc(sizeDiff);

        const hitAmount = Math.min(opp.health, ctx.creature.dna.size + globalParams.rules.attackHit.calc(sizeDiff));
        if (hitAmount < opp.health && hitAmount <= attackPenalty) {
            // No use for attacking
            return;
        }
        if (ctx.creature.dna.size < opp.dna.size && !checkChance(globalParams.rules.attackSuccessChangeForSmallerCreature))
        {
            return;
        }
        if (!checkChance(this.def.chance)) {
            return;
        }

        if (checkChance(attackSuccessChance)) {
            opp.reduceHealth(hitAmount, ctx);

            if (opp.health == 0) {
                ctx.world.matrix[oppPos.x][oppPos.y].creature = null;
                ctx.moveCreatureTo(oppPos.x, oppPos.y);
                ctx.statsCounter.tick('kill', ctx.creature.type);
            }
        }

        ctx.creature.reduceHealth(attackPenalty, ctx);
    }

    private _findAttackOpponent(ctx: CycleContext): Pos {
        let neighbours: Pos[] = ctx.world.getNeighbouringPositions(ctx.x, ctx.y);
        let options: Pos[] = neighbours.filter(n => {
            const cell: Cell = ctx.world.matrix[n.x][n.y];
            return (cell.creature && cell.creature.type != ctx.creature.type);
        });

        return getRandomArrItem(options);
    }

}