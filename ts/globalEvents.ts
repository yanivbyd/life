import { randomInt } from "./utils/random.js";
import { World } from "./world.js";
import { globalParams } from "./worldParams.js";
import {randomBool} from "./utils/random.js";
import { Formula } from "./rules/formula.js";
import { Penalties } from "./rules/penalties.js";
import { VegShapes } from "./vegShapes.js";

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
        const randomIndex = randomInt(1, 10);
        switch (randomIndex) {
            case 1:
                if (randomBool()) {
                    if (globalParams.env.extraRain > -5) {
                        globalParams.env.extraRain -= randomInt(1, 3);
                        return 'Less rain (extra rain = ' + (globalParams.env.extraRain) + ')';
                    }
                    return null;
                } else {
                    globalParams.env.extraRain += randomInt(1, 3);
                    return 'More rain (extra rain = ' + (globalParams.env.extraRain) + ')';
                }
            case 2:
                const cAmount = randomInt(1500, 5000);
                this.world.addCreatures(cAmount);
                return 'Adding ' + cAmount + ' creatures';
            case 3:
            case 4:
                const vegShapes = new VegShapes(this.world);
                vegShapes.updateTerrain(randomIndex == 3);
                vegShapes.ensureMinNoRainCells(0.05, 0.25);
                return (randomIndex == 3 ? 'More rain terrain' : 'Less rain terrain');
                break;
            case 5:
                return this._updateFormula(globalParams.penalties.moving, 0,
                    'Harder to move (penalty=', ')',
                    'Easier to move (penalty=', ')'
                );
            case 6:
                return this._updateFormula(globalParams.rules.creatureMaxHealth, 3,
                    'Higher max health (', ')',
                    'Lower max health (', ')'
                );
            case 7:
                return this._updateFormula(globalParams.rules.maxVegToEat, 2,
                    'Higher max veg to eat (', ')',
                    'Lower max veg to eat (', ')'
                );
            case 8:
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
            case 9:
                return this._updateFormula(globalParams.penalties.birth, 0,
                    'Harder to breed (penalty=', ')',
                    'Easier to breed (penalty=', ')'
                );
            case 10:
                const deathChance = randomInt(90,95);
                const creatureType = this.world.topCreaturePlague(deathChance);
                if (!creatureType) return null;
                return "Plague, killing " + deathChance + "% of " + globalParams.creatures[creatureType].name;
        }
        return null;
    }

    private _updateFormula(formula: Formula, minValue: number,
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
                if (formula.base-1 < minValue) return null;
                formula.base--;
                return decPrefix + formula.describe() + decSuffix;
            case 4:
                if (formula.sizeCoef <= 0.2) return null;
                formula.sizeCoef = ((formula.sizeCoef*10) - 2)/10;
                return decPrefix + formula.describe() + decSuffix;
        }
    }

}
