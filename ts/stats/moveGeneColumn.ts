import { Cell } from "../cell.js";
import { World } from "../world.js";
import { globalParams } from "../worldParams.js";
import { CreatureDefs } from "../worldParamsDefs.js";

export class MoveGeneColumn {
    chanceTotals: number[];
    minVegAmountTotals: number[];
    counts: number[];

    getTitle(): string {
        return 'move genes (min veg, chance)';
    }
    getValue(world: World, type: number, def: CreatureDefs): string {
        if (this.counts[type]==0) {
            return def.move.minVegAmount.toFixed(1) + ' , ' + def.move.chance.toFixed(0) + '%';
        };

        const chanceStr = (this.chanceTotals[type] / this.counts[type]).toFixed(0) + '%';
        const minVegStr = (this.minVegAmountTotals[type] / this.counts[type]).toFixed(1);
        return '' + minVegStr + ' , ' + chanceStr;
    }

    onCycle(world: World) {
        this.counts = [];
        this.chanceTotals = [];
        this.minVegAmountTotals = [];

        for (var type=0; type<globalParams.creatures.length;type++) {
            this.counts[type] = 0;
            this.chanceTotals[type] = 0;
            this.minVegAmountTotals[type] = 0;
        }
    }
    onCell(cell: Cell) {
        if (cell.creature) {
            this.counts[cell.creature.type]++;
            this.chanceTotals[cell.creature.type] += cell.creature.dna.moveDef.chance;
            this.minVegAmountTotals[cell.creature.type] += cell.creature.dna.moveDef.minVegAmount;
        }
    }
}
