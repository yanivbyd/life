import { CreatureAction } from "../creatureAction.js";
import { CycleContext } from "../cycle/cycleContext.js";
import {assertNotHigher, assertNotNegative } from "../utils/assert.js";
import {MoveDef} from "./moveAction";

export class EatDef {
    isWaterCreature: boolean
}

export class EatVegAction implements CreatureAction {
    def: EatDef;

    constructor(def: EatDef) {
        this.def = def;
    }

    cycle(ctx: CycleContext): void {
        const creature = ctx.creature;
        const eatPenalty: number = ctx.penalties.eating.calc(creature.dna.size);
        const maxEat: number = ctx.rules.maxVegToEat.calc(creature.dna.size);
        const maxHealth: number = ctx.rules.creatureMaxHealth.calc(creature.dna.size);
        const maxHealthToGain: number = maxHealth - creature.health;

        if ((this.def.isWaterCreature && ctx.cell.isWater) || (!this.def.isWaterCreature && !ctx.cell.isWater)) {
            const eatAmount: number = Math.min(maxEat, ctx.cell.veg, maxHealthToGain);
            if (eatAmount > eatPenalty) {
                creature.incHealth(eatAmount);
                ctx.cell.veg -= eatAmount;
            }
            assertNotNegative(ctx.cell.veg);
            assertNotHigher(creature.health, maxHealth);
        }
        creature.reduceHealth(eatPenalty, ctx);
    }

}
