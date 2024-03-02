import { Cell } from "../cell.js";
import {World} from "../world.js";
import {CreatureDefs} from "../worldParams.js";
import {StatColumn} from "./statColumn.js";

export class NameColumn implements StatColumn {
    onCycle(world: World) {
    }
    onCell(cell: Cell) {
    }
    getTitle(): string {
        return "name"
    }
    getValue(world: World, type: number, def: CreatureDefs): string {
        return def.name;
    }
}