import { randomInt } from "./utils/random.js";
import { World } from "./world.js";

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

            $('.toast-title').text('Global Event')
            $('.toast-body').text(eventDescription);
            $('#toast').addClass('toast-show');
            setTimeout(function() {
                $('#toast').removeClass('toast-show');
            }, 4000);

            this._updateNextEventTime();
        }
    }
    private _updateNextEventTime() {
        this.nextEventTime = this.world.currentCycle + randomInt(100, 200);
    }
    private _runRandomEvent(): string {
        const randomIndex = randomInt(1, 3);
        switch (randomIndex) {
            case 1:
                if (this.world.rainDelta > -2) {
                    this.world.rainDelta--;
                    return 'less rain (delta=' + this.world.rainDelta + ')';
                }
                return null;
            case 2:
                this.world.rainDelta++;
                return 'more rain (delta=' + this.world.rainDelta + ')';
            case 3:
                this.world.addCreatures();
                return 'adding creatures';
        }
        return null;
    }
}
