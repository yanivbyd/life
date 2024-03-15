import { World } from "./world.js";
import {Cell} from "./cell.js";
import {globalParams} from "./worldParams.js";
import {checkChance, randomInt} from "./utils/random.js";
import { Pos } from "./pos.js";
import { inRange } from "./utils/utils.js";

export class Killer {
    playedCycle: number;
    killRadius: number;
    dest: Pos;

    constructor(killRadius: number, dest: Pos) {
        this.dest = dest
        this.playedCycle = 0;
        this.killRadius = killRadius;
    }

    cycle(world: World, x: number, y: number): void {
        const radius = this.killRadius;
        if (this.playedCycle >= world.currentCycle) {
            return;
        }
        this.playedCycle = world.currentCycle;

        for (var x1=x-radius;x1<=x+radius;x1++) {
            for (var y1=y-radius;y1<=y+radius;y1++) {
                if (!world.isValid(x1, y1)) continue;
                const distance: number = this._calcDist(x1, y1, x, y);
                if (distance <= radius && distance <= randomInt(0, radius)) {
                    const cell = world.matrix[x1][y1];
                    cell.veg = 0;
                    cell.playedCycle = this.playedCycle;
                    if (cell.creature) {
                        cell.creature = null;
                    }
                }
            }
        }

        if (x == this.dest.x && y == this.dest.y) {
            world.matrix[x][y].killer = null;
            return;
        }

        var newX = x;
        var newY = y;
        const dx = Math.abs(x - this.dest.x);
        const dy = Math.abs(y - this.dest.y);
        if (randomInt(0 , dx + dy) <= dx) {
            newX += (x < this.dest.x ? 1 : -1);
        } else {
            newY += (y < this.dest.y ? 1 : -1);
        }
        if (world.isValid(newX, newY)) {
            world.matrix[x][y].killer = null;
            world.matrix[newX][newY].killer = this;
        }
        this.killRadius = inRange(this.killRadius+randomInt(-1, 1), 1, 200);

        if (checkChance(1)) {
            this.dest = new Pos(randomInt(0, world.width - 1), randomInt(0, world.height - 1));
        }
    }

    private _calcDist(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt((x2 - x1)**2 + (y2 - y1)**2);
    }

}