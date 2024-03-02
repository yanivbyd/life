import { globalParams } from "../worldParams.js";

export class CycleStatsCounter {
    global: [];
    perType: Object[];

    constructor() {
        this.global = [];
        this.perType = [];
        for (let type=0;type<globalParams.creatures.length;type++) {
            this.perType.push({});
        }
    }

    tick(name: string, type: number) {
        this.global[name] = this.global[name] || 0;
        this.global[name]++;
        this.perType[type][name] = this.perType[type][name] || 0;
        this.perType[type][name]++;
    }
}