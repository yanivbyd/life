import { World } from "./world.js";
import {Cell} from "./cell.js";
import {globalParams} from "./worldParams.js";
import {randomInt} from "./utils/random.js";

export class Killer {
    killRadius: number;
    timeToLive: number;
    directionX: number;
    directionY: number;
    playedCycle: number;

    constructor(timeToLive: number, killRadius: number, dx: number, dy: number) {
        this.timeToLive = timeToLive;
        this.directionX = dx;
        this.directionY = dy;
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
        this.timeToLive--;
        if (this.timeToLive <= 0) {
            world.matrix[x][y].killer = null;
        } else {
            const newX = x+this.directionX;
            const newY = y+this.directionY;
            if (world.isValid(newX, newY)) {
                world.matrix[newX][newY].killer = this;
                world.matrix[x][y].killer = null;
            }
        }
    }

    private _calcDist(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt((x2 - x1)**2 + (y2 - y1)**2);
    }

}