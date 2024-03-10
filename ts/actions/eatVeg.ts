import { CreatureAction } from "../creatureAction.js";
import { CycleContext } from "../cycle/cycleContext.js";
import {assertNotHigher, assertNotNegative } from "../utils/assert.js";
import {MoveDef} from "./moveAction";

export class EatDef {
    vegIsPoison: boolean
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

        if (this.def.vegIsPoison) {
            const vegAmountToEat = Math.min(creature.health, ctx.cell.veg, maxEat);
            ctx.creature.reduceHealth(vegAmountToEat, ctx); // poison
            if (creature.health > 0) {
                const eatAmount = Math.min(ctx.rules.reverseVegInCell - ctx.cell.veg, maxHealth - creature.health);
                creature.health += eatAmount;
            }
            ctx.cell.veg -= vegAmountToEat;
        } else {
            const eatAmount: number = Math.min(maxEat, ctx.cell.veg, maxHealthToGain);
            if (eatAmount > eatPenalty) {
                creature.health += eatAmount - eatPenalty;
                ctx.cell.veg -= eatAmount;
            }

            assertNotNegative(ctx.cell.veg);
            assertNotHigher(ctx.creature.health, maxHealth);
        }
    }

}
