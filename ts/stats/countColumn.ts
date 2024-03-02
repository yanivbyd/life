import { Cell } from "../cell.js";
import { World } from "../world.js";
import { CreatureDefs, globalParams } from "../worldParams.js";
import {StatColumn} from "./statColumn.js";

export class CountColumn implements StatColumn {
    counts: number[];
    getTitle(): string {
        return "count";
    }
    getValue(world: World, type: number, def: CreatureDefs): string {
        return '' + this.counts[type];
    }

    onCycle(world: World) {
        this.counts = [];
        for (var i=0; i<globalParams.creatures.length;i++) {
            this.counts[i] = 0;
        }
    }
    onCell(cell: Cell) {
        if (cell.creature) {
            this.counts[cell.creature.type]++;
        }
    }
}