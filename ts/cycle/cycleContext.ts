import { CreatureDNA } from "../actions/dna.js";
import { Cell } from "../cell.js";
import { Creature } from "../creature.js";
import { Pos } from "../pos.js";
import { GameRules } from "../rules/gameRules.js";
import { Penalties } from "../rules/penalties.js";
import { CycleStatsCounter } from "../stats/cycleStatsCounter.js";
import {assertNotHigher, assertNotNegative, assertNull } from "../utils/assert.js";
import { World } from "../world.js";
import { globalParams } from "../worldParams.js";

export class CycleContext {
    world: World;
    creature: Creature;
    cell: Cell;
    x: number;
    y: number;

    rules: GameRules;
    penalties: Penalties;

    statsCounter: CycleStatsCounter;

    creatureDied() {
        this.world.matrix[this.x][this.y].creature = null;
    }

    moveCreatureTo(x: number, y: number) {
        assertNotNegative(x);
        assertNotNegative(y);
        assertNotHigher(x, this.world.width-1);
        assertNotHigher(y, this.world.height-1);

        const cell: Cell = this.world.matrix[x][y];
        assertNull(cell.creature);
        cell.creature = this.creature;
        this.cell.creature = null;

        this.cell = cell;
        this.x = x;
        this.y = y;
    }

    createBaby(babyPos: Pos, babyHealth: number, parent: Creature, babyDNA: CreatureDNA) {
        const baby = new Creature(
            parent.type,
            babyHealth,
            parent.size,
            babyDNA
        );
        baby.playedCycle = this.world.currentCycle;
        const babyCell: Cell = this.world.matrix[babyPos.x][babyPos.y];
        assertNull(babyCell.creature);
        babyCell.creature = baby;
    }
}