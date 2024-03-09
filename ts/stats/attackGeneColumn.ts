import { Cell } from "../cell.js";
import { World } from "../world.js";
import { globalParams } from "../worldParams.js";
import { CreatureDefs } from "../worldParamsDefs.js";

export class AttackGeneColumn {
    chanceTotals: number[];
    counts: number[];

    getTitle(): string {
        return 'attack (chance)';
    }
    getValue(world: World, type: number, def: CreatureDefs): string {
        if (this.counts[type]==0) {
            return def.attack.chance.toFixed(0) + '%';
        };

        const chanceStr = (this.chanceTotals[type] / this.counts[type]).toFixed(0) + '%';
        return chanceStr;
    }

    onCycle(world: World) {
        this.counts = [];
        this.chanceTotals = [];

        for (var type=0; type<globalParams.creatures.length;type++) {
            this.counts[type] = 0;
            this.chanceTotals[type] = 0;
        }
    }
    onCell(cell: Cell) {
        if (cell.creature) {
            this.counts[cell.creature.type]++;
            this.chanceTotals[cell.creature.type] += cell.creature.dna.moveDef.chance;
        }
    }
}
