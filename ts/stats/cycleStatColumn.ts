import { Cell } from "../cell";
import { World } from "../world";
import { globalParams } from "../worldParams.js";
import { CreatureDefs } from "../worldParamsDefs";
import {StatColumn} from "./statColumn";

export class CycleStatColumn implements StatColumn {
    title: string;
    actionName: string;

    constructor(title: string, actionName: string) {
        this.title = title;
        this.actionName = actionName;
    }

    getTitle(): string {
        return this.title;
    }
    getValue(world: World, type: number, def: CreatureDefs): string {
        return '' + (world.statsCounter.perType[type][this.actionName] || 0);
    }
    onCycle(world: World) {
    }
    onCell(cell: Cell) {
    }

}