import { randomInt } from "./utils/random.js";
import { World } from "./world.js";
import { globalParams } from "./worldParams.js";
import {randomBool} from "./utils/random.js";
import { Formula } from "./rules/formula.js";
import { Penalties } from "./rules/penalties.js";

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
                $('.toast-title').text('Global Event (cycle ' + this.world.currentCycle + ')');
                $('.toast-body').text(eventDescription);
                $('#toast').addClass('toast-show');
                setTimeout(function () {
                    $('#toast').removeClass('toast-show');
                }, 4000);
                if (window['global_table_render']) {
                    window['global_table_render'].renderRulesTable();
                }
            }

            this._updateNextEventTime();
        }
    }

    private _updateNextEventTime() {
        this.nextEventTime = this.world.currentCycle + randomInt(100, 200);
    }

    private _runRandomEvent(): string {
        const randomIndex = randomInt(1, 4);
        switch (randomIndex) {
            case 1:
                if (randomBool()) {
                    if (this.world.rainDelta > -2) {
                        this.world.rainDelta--;
                        return 'Less rain (' + (this.world.rainDelta + globalParams.env.rain) + ')';
                    }
                    return null;
                } else {
                    this.world.rainDelta++;
                    return 'More rain (' + (this.world.rainDelta + globalParams.env.rain) + ')';
                }
            case 2:
                for (var i = 0; i < 5; i++) {
                    this.world.addCreatures();
                }
                return 'Adding creatures';
            case 3:
                return this._updateFormula(globalParams.penalties.moving,
                    'Harder to move (penalty=', ')',
                    'Easier to move (penalty=', ')'
                );
            case 4:
                const amount = randomInt(1, 5);
                if (randomBool()) {
                    globalParams.env.maxVeg += amount;
                    return 'More veg per cell (' + globalParams.env.maxVeg + ')';
                } else if (globalParams.env.maxVeg > amount + 1) {
                    globalParams.env.maxVeg -= amount;
                    this.world.ensureNoVegBeyondMaxVeg();
                    return 'Less veg per cell (' + globalParams.env.maxVeg + ')';
                }
                return null;
        }
        return null;
    }

    private _updateFormula(formula: Formula,
                           incPrefix: string, incSuffix: string,
                           decPrefix: string, decSuffix: string): string {
        switch (randomInt(1, 4)) {
            case 1:
                formula.base++;
                return incPrefix + formula.describe() + incSuffix;
            case 2:
                formula.sizeCoef = ((formula.sizeCoef*10) + 2)/10;
                return incPrefix + formula.describe() + incSuffix;
            case 3:
                if (formula.base <= 0) return null;
                formula.base--;
                return decPrefix + formula.describe() + decSuffix;
            case 4:
                if (formula.sizeCoef <= 0.2) return null;
                formula.sizeCoef = ((formula.sizeCoef*10) - 2)/10;
                return decPrefix + formula.describe() + decSuffix;
        }
    }

}
