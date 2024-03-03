import { CreatureAction } from './creatureAction.js';
import { CycleContext } from './cycle/cycleContext.js';
import { DNA } from './actions/dna.js';
import { CreatureDefs, globalParams } from './worldParams.js';
import {checkChance} from "./utils/random.js";

export class Creature {
    health: number;
    type: number;
    size: number;
    playedCycle: number;
    dna: DNA;

    constructor(type: number, health: number, size: number, dna: DNA) {
        this.type = type;
        this.health = health;
        this.size = size;
        this.dna = dna;
        this.playedCycle = 0;
    }

    cycle(ctx: CycleContext): void {
        if (this.playedCycle >= ctx.world.currentCycle) {
            // already played (and probably moved) this cycle
            return;
        }
        this.playedCycle = ctx.world.currentCycle;
        this.reduceHealth(ctx.penalties.breathing.calc(this.size), ctx);

        for (let i=0;i<this.dna.actions.length;i++) {
            if (!this.isDead()) {
                this.dna.actions[i].cycle(ctx);
            }
        }
        if (!this.isDead()) {
            const deathChance = Math.max(1, ctx.rules.deathChance.calc(this.size));
            if (checkChance(deathChance)) {
                ctx.creatureDied();
                ctx.statsCounter.tick("death", this.type);
            }
        }
    }

    reduceHealth(amount: number, ctx: CycleContext) {
        this.health -= amount;
        if (this.health <= 0) {
            ctx.creatureDied();
            ctx.statsCounter.tick("death", this.type);
        }
    }
    isDead(): boolean {
        return this.health <= 0;
    }

    getTypeDef(): CreatureDefs {
        return globalParams.creatures[this.type];
    }
}