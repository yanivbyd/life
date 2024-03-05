import { Cell } from "../cell.js";
import { World } from "../world.js";
import { CreatureDefs } from "../worldParamsDefs.js";

export interface StatColumn {
    getTitle(): string;
    getValue(world: World, type: number, def: CreatureDefs): string;
    onCycle(world: World);
    onCell(cell: Cell);
}