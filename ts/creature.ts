import { CreatureAction } from './creatureAction.js';
import { CycleContext } from './cycle/cycleContext.js';
import { CreatureDefs, globalParams } from './worldParams.js';

export class Creature {
    health: number;
    type: number;
    size: number;
    playedCycle: number;
    actions: CreatureAction[];

    constructor(type: number, health: number, size: number, actions: CreatureAction[]) {
        this.type = type;
        this.health = health;
        this.size = size;
        this.actions = actions;
        this.playedCycle = 0;
    }

    cycle(ctx: CycleContext): void {
        if (this.playedCycle >= ctx.world.currentCycle) {
            // already played (and probably moved) this cycle
            return;
        }
        this.playedCycle = ctx.world.currentCycle;
        this.reduceHealth(ctx.penalties.breathing.calc(this.size), ctx);

        for (let i=0;i<this.actions.length;i++) {
            if (!this.isDead()) {
                this.actions[i].cycle(ctx);
            }
        }
    }

    reduceHealth(amount: number, ctx: CycleContext) {
        this.health -= amount;
        if (this.health <= 0) {
            ctx.creatureDied();
        }
    }
    isDead(): boolean {
        return this.health <= 0;
    }

    getTypeDef(): CreatureDefs {
        return globalParams.creatures[this.type];
    }
}