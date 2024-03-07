import { Cell } from "../cell.js";
import { World } from "../world.js";
import { globalParams } from "../worldParams.js";
import { CreatureDefs } from "../worldParamsDefs.js";

export class VegCountColumn {
    vegCountTotals: number[];
    counts: number[];

    getTitle(): string {
        return 'veg in cell';
    }
    getValue(world: World, type: number, def: CreatureDefs): string {
        if (this.counts[type]==0) {
            return '';
        };
        return '' + (this.vegCountTotals[type] / this.counts[type]).toFixed(1);
    }

    onCycle(world: World) {
        this.counts = [];
        this.vegCountTotals = [];

        for (var type=0; type<globalParams.creatures.length;type++) {
            this.counts[type] = 0;
            this.vegCountTotals[type] = 0;
        }
    }
    onCell(cell: Cell) {
        if (cell.creature) {
            this.counts[cell.creature.type]++;
            this.vegCountTotals[cell.creature.type] += cell.veg;
        }
    }
}
