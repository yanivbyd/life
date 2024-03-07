import { randomInt } from "./utils/random.js";
import { World } from "./world.js";
import { globalParams } from "./worldParams.js";

export class GlobalEvents {
    world: World;
    nextEventTime: number;

    constructor(world: World) {
        this.world = world;
        this._updateNextEventTime();
    }

    cycle() {
        if (this.world.currentCycle >= this.nextEventTime) {
            const eventDescription = this._runRandomEvent();
            if (eventDescription) {
                $('.toast-title').text('Global Event');
                $('.toast-body').text(eventDescription);
                $('#toast').addClass('toast-show');
                setTimeout(function () {
                    $('#toast').removeClass('toast-show');
                }, 4000);
            }

            this._updateNextEventTime();
        }
    }
    private _updateNextEventTime() {
        this.nextEventTime = this.world.currentCycle + randomInt(100, 200);
    }
    private _runRandomEvent(): string {
        const randomIndex = randomInt(1, 5);
        switch (randomIndex) {
            case 1:
                if (this.world.rainDelta > -2) {
                    this.world.rainDelta--;
                    return 'Less rain (delta=' + this.world.rainDelta + ')';
                }
                return null;
            case 2:
                this.world.rainDelta++;
                return 'More rain (delta=' + this.world.rainDelta + ')';
            case 3:
                for (var i=0;i<5;i++) {
                    this.world.addCreatures();
                }
                return 'Adding creatures';
            case 4:
                if (globalParams.penalties.moving.base > 0) {
                    globalParams.penalties.moving.base--;
                    return 'Easier to move (penalty=' + globalParams.penalties.moving.describe() + ')';
                }
                break;
            case 5:
                globalParams.penalties.moving.base++;
                return 'Harder to move (penalty=' + globalParams.penalties.moving.describe() + ')';
        }
        return null;
    }
}
