import { CreatureAction } from "../creatureAction.js";
import { CycleContext } from "../cycle/cycleContext.js";
import {assertNotHigher, assertNotNegative } from "../utils/assert.js";

export class EatVegAction implements CreatureAction {

    cycle(ctx: CycleContext): void {
        const maxEat: number = ctx.rules.maxVegToEat.calc(ctx.creature.size);
        const maxHealth: number = ctx.rules.creatureMaxHealth.calc(ctx.creature.size);
        const maxHealthToGain: number = maxHealth - ctx.creature.health;
        const eatAmount: number = Math.min(maxEat, ctx.cell.veg, maxHealthToGain);
        ctx.creature.health += eatAmount;
        ctx.cell.veg -= eatAmount;

        assertNotNegative(ctx.cell.veg);
        assertNotHigher(ctx.creature.health, maxHealth);
    }

}
