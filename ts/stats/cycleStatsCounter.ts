import { globalParams } from "../worldParams.js";

export class CycleStatsCounter {
    perType: Object[];

    constructor() {
        this.perType = [];
        for (let type=0;type<globalParams.creatures.length;type++) {
            this.perType.push({});
        }
    }

    tick(name: string, type: number) {
        this.perType[type][name] = this.perType[type][name] || 0;
        this.perType[type][name]++;
    }
}