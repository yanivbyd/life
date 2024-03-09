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
        const that = this;

        $(document).ready(function() {
            that._addEventButtons();
        });
    }

    showMessageAndReder(messgae: string) {
        if (messgae) {
            $('.toast-title').text('Global Event (cycle ' + this.world.currentCycle + ')');
            $('.toast-body').text(messgae);
            $('#toast').addClass('toast-show');
            setTimeout(function () {
                $('#toast').removeClass('toast-show');
            }, 4000);
            if (window['global_table_render']) {
                window['global_table_render'].renderRulesTable();
            }
        }
    }
    cycle() {
        if (this.world.currentCycle >= this.nextEventTime) {
            const eventDescription = this._runRandomEvent();
            this.showMessageAndReder(eventDescription);

            this._updateNextEventTime();
        }
    }

    private _updateNextEventTime() {
        this.nextEventTime = this.world.currentCycle + randomInt(100, 200);
    }

    private _runRandomEvent(): string {
        const randomIndex = randomInt(1, 15);
        switch (randomIndex) {
            case 1:
                return this._lessRain();
            case 2:
                return this._moreRain();
            case 3:
                return this._addCreatures();
            case 4:
                return this._moreRainTerrain();
            case 5:
                return this._lessRainTerrain();
            case 6:
                return this._moveEasier();
            case 7:
                return this._moveHarder();
            case 8:
                return this._maxHealthEasier();
            case 9:
                return this._maxHealthHarder();
            case 10:
                return this._updateFormulaInc(globalParams.rules.maxVegToEat,
                    'Higher max veg to eat (', ')');
            case 11:
                return this._updateFormulaDec(globalParams.rules.maxVegToEat, 2,
                    'Lower max veg to eat (', ')');
            case 12:
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
            case 13:
                return this._updateFormulaDec(globalParams.penalties.birth, 0,
                    'Easier to breed (penalty=', ')'
                );
            case 14:
                return this._updateFormulaInc(globalParams.penalties.birth,
                    'Harder to breed (penalty=', ')'
                );
            case 15:
                const deathChance = randomInt(90,95);
                const creatureType = this.world.topCreaturePlague(deathChance);
                if (!creatureType) return null;
                return "Plague, killing " + deathChance + "% of " + globalParams.creatures[creatureType].name;
        }
        return null;
    }

    private _updateFormulaInc(formula: Formula,
                              prefix: string, suffix: string): string {
        switch (randomInt(1, 2)) {
            case 1:
                formula.base++;
                return prefix + formula.describe() + suffix;
            case 2:
                formula.sizeCoef = ((formula.sizeCoef * 10) + 2) / 10;
                return prefix + formula.describe() + suffix;
        }
    }

    private _updateFormulaDec(formula: Formula, minValue: number,
                              prefix: string, suffix: string): string {
        switch (randomInt(1, 2)) {
            case 1:
                if (formula.base < minValue) return null;
                formula.base--;
                return prefix + formula.describe() + suffix;
            case 2:
                if (formula.sizeCoef <= 0.2) return null;
                formula.sizeCoef = ((formula.sizeCoef * 10) - 2) / 10;
                return prefix + formula.describe() + suffix;
        }
    }

    private _addEventButtons() {
        const that = this;
        const div = $('#global_events');

        $('<button/>').addClass("btn btn-outline-success").appendTo(div)
            .text("Add Creatures")
            .click(function() { that.showMessageAndReder(that._addCreatures()); });

        $('<div/>').appendTo(div);
        $('<button/>').addClass("btn btn-outline-success").appendTo(div)
            .text("More Extra Rain")
            .click(function() { that.showMessageAndReder(that._moreRain()); });
        $('<button/>').addClass("btn btn-outline-warning").appendTo(div)
            .text("Less Extra Rain")
            .click(function() { that.showMessageAndReder(that._lessRain()); });
        $('<button/>').addClass("btn btn-outline-success").appendTo(div)
            .text("More Rain (terrain)")
            .click(function() { that.showMessageAndReder(that._moreRainTerrain()); });
        $('<button/>').addClass("btn btn-outline-warning").appendTo(div)
            .text("Less Rain (terrain)")
            .click(function() { that.showMessageAndReder(that._lessRainTerrain()); });

        $('<div/>').appendTo(div);
        $('<button/>').addClass("btn btn-outline-success").appendTo(div)
            .text("Move")
            .click(function() { that.showMessageAndReder(that._moveEasier()); });
        $('<button/>').addClass("btn btn-outline-success").appendTo(div)
            .text("Max health")
            .click(function() { that.showMessageAndReder(that._maxHealthEasier()); });

        $('<div/>').appendTo(div);
        $('<button/>').addClass("btn btn-outline-warning").appendTo(div)
            .text("Move")
            .click(function() { that.showMessageAndReder(that._moveHarder()); });
        $('<button/>').addClass("btn btn-outline-warning").appendTo(div)
            .text("Max health")
            .click(function() { that.showMessageAndReder(that._maxHealthHarder()); });
    }

    private _moreRain(): string {
        globalParams.env.extraRain += randomInt(1, 3);
        return 'More rain (extra rain = ' + (globalParams.env.extraRain) + ')';
    }

    private _lessRain(): string {
        globalParams.env.extraRain -= randomInt(1, 3);
        return 'Less rain (extra rain = ' + (globalParams.env.extraRain) + ')';
    }

    private _moreRainTerrain(): string {
        const vegShapes = new VegShapes(this.world);
        vegShapes.updateTerrain(true);
        vegShapes.ensureMinNoRainCells(0, 0.25);
        return 'More rain (terrain)';
    }

    private _lessRainTerrain(): string {
        const vegShapes = new VegShapes(this.world);
        vegShapes.updateTerrain(false);
        vegShapes.ensureMinNoRainCells(0.1, 0.35);
        return 'Less rain (terrain)';
    }

    private _addCreatures(): string {
        const cAmount = randomInt(1500, 6000);
        this.world.addCreatures(cAmount);
        return 'Adding ' + cAmount + ' creatures';
    }

    private _moveEasier(): string {
        return this._updateFormulaDec(globalParams.penalties.moving, 0,
            'Easier to move (penalty=', ')'
        );
    }

    private _moveHarder(): string {
        return this._updateFormulaDec(globalParams.penalties.moving, 0,
            'Harder to move (penalty=', ')'
        );
    }

    private _maxHealthEasier(): string {
        return this._updateFormulaInc(globalParams.rules.creatureMaxHealth,
            'Higher health (max health=', ')'
        );
    }

    private _maxHealthHarder(): string {
        return this._updateFormulaDec(globalParams.rules.creatureMaxHealth, 3,
            'Lower health (max health=', ')'
        );
    }

}
