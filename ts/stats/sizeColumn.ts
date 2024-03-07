import { Cell } from "../cell.js";
import { World } from "../world.js";
import { globalParams } from "../worldParams.js";
import { CreatureDefs } from "../worldParamsDefs.js";

export class SizeColumn {
    sizeTotals: number[];
    counts: number[];

    getTitle(): string {
        return 'size';
    }
    getValue(world: World, type: number, def: CreatureDefs): string {
        if (this.counts[type]==0) {
            return '' + def.size;
        };
        return '' + (this.sizeTotals[type] / this.counts[type]).toFixed(1);
    }

    onCycle(world: World) {
        this.counts = [];
        this.sizeTotals = [];

        for (var type=0; type<globalParams.creatures.length;type++) {
            this.counts[type] = 0;
            this.sizeTotals[type] = 0;
        }
    }
    onCell(cell: Cell) {
        if (cell.creature) {
            this.counts[cell.creature.type]++;
            this.sizeTotals[cell.creature.type] += cell.creature.dna.size;
        }
    }
}
