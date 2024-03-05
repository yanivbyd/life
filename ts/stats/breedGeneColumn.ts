import { Cell } from "../cell.js";
import { World } from "../world.js";
import { globalParams } from "../worldParams.js";
import { CreatureDefs } from "../worldParamsDefs.js";

export class BreedGeneColumn {
    chanceTotals: number[];
    minHealthTotals: number[];
    counts: number[];

    getTitle(): string {
        return 'breed genes (min health, chance)';
    }
    getValue(world: World, type: number, def: CreatureDefs): string {
        if (this.counts[type]==0) {
            return def.breed.minHealth.toFixed(1) + ' , ' + def.breed.chance.toFixed(0) + '%';
        };

        const chanceStr = (this.chanceTotals[type] / this.counts[type]).toFixed(0) + '%';
        const minVegStr = (this.minHealthTotals[type] / this.counts[type]).toFixed(1);
        return '' + minVegStr + ' , ' + chanceStr;
    }

    onCycle(world: World) {
        this.counts = [];
        this.chanceTotals = [];
        this.minHealthTotals = [];

        for (var type=0; type<globalParams.creatures.length;type++) {
            this.counts[type] = 0;
            this.chanceTotals[type] = 0;
            this.minHealthTotals[type] = 0;
        }
    }
    onCell(cell: Cell) {
        if (cell.creature) {
            this.counts[cell.creature.type]++;
            this.chanceTotals[cell.creature.type] += cell.creature.dna.breedDef.chance;
            this.minHealthTotals[cell.creature.type] += cell.creature.dna.breedDef.minHealth;
        }
    }
}
