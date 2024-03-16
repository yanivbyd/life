import { Cell } from "../cell.js";
import { World } from "../world.js";
import { globalParams } from "../worldParams.js";
import { CreatureDefs } from "../worldParamsDefs.js";

export class BreedGeneColumn {
    minHealthTotals: number[];
    counts: number[];

    getTitle(): string {
        return 'breed (min health)';
    }
    getValue(world: World, type: number, def: CreatureDefs): string {
        if (this.counts[type]==0) {
            return def.breed.minHealth.toFixed(1);
        };

        return (this.minHealthTotals[type] / this.counts[type]).toFixed(1);
    }

    onCycle(world: World) {
        this.counts = [];
        this.minHealthTotals = [];

        for (var type=0; type<globalParams.creatures.length;type++) {
            this.counts[type] = 0;
            this.minHealthTotals[type] = 0;
        }
    }
    onCell(cell: Cell) {
        if (cell.creature) {
            this.counts[cell.creature.type]++;
            this.minHealthTotals[cell.creature.type] += cell.creature.dna.breedDef.minHealth;
        }
    }
}
