import { randomInt, runRandomTimes } from "./utils/random.js";
import { World } from "./world.js";
import { globalParams } from "./worldParams.js";
import {randomBool} from "./utils/random.js";
import { Formula } from "./rules/formula.js";
import { Penalties } from "./rules/penalties.js";
import { VegShapes } from "./vegShapes.js";
import {getRandomArrItem} from "./utils/random.js";

export class GlobalEvents {
    world: World;
    nextEventTime: number;

    constructor(world: World) {
        this.world = world;
        this._updateNextEventTime();
        const that = this;

        $(document).ready(function () {
            that._addEventButtons();
        });
    }

    showMessageAndRender(messgae: string) {
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
            this._updateNextEventTime();
            $(getRandomArrItem($('#global_events button').toArray())).click();
        }
    }

    private _updateNextEventTime() {
        this.nextEventTime = this.world.currentCycle + randomInt(80, 120);
    }

    private _plague(): string {
        const deathChance = randomInt(90, 95);
        const creatureType = this.world.topCreaturePlague(deathChance);
        if (!creatureType) return null;
        return "Plague, killing " + deathChance + "% of " + globalParams.creatures[creatureType].name;
    }

    private _breedHarder(): string {
        return this._updateFormulaInc(globalParams.penalties.birth,
            'Harder to breed (penalty=', ')'
        );
    }

    private _incVal(obj: Object, field: string, amount: number,
                    prefix: string, suffix: string): string {
        obj[field] += amount;
        return prefix + obj[field] + suffix;
    }

    private _decVal(obj: Object, field: string, amount: number,
                    prefix: string, suffix: string): string {
        obj[field] -= amount;
        return prefix + obj[field] + suffix;
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
            .click(function () {
                that.showMessageAndRender(that._addCreatures());
            });
        $('<button/>').addClass("btn btn-outline-danger").appendTo(div)
            .text("Plague (top creature)")
            .click(function () {
                that.showMessageAndRender(that._plague());
            });
        $('<button/>').addClass("btn btn-outline-danger").appendTo(div)
            .text("Add killers")
            .click(function () {
                const kAmount = randomInt(3, 6);
                that.world.addKillers(kAmount);
                that.showMessageAndRender('Adding ' + kAmount + ' killers');
            });

        $('<div/>').appendTo(div);
        $('<button/>').addClass("btn btn-outline-success").appendTo(div)
            .text("More Veg")
            .css('width', '100px')
            .click(function () {
                that.world.addVeg(randomInt(1, 3));
                that.showMessageAndRender('Move vegetation');
            });
        $('<button/>').addClass("btn btn-outline-success").appendTo(div)
            .text("Rain (terrain)")
            .click(function() { that.showMessageAndRender(that._moreRainTerrain()); });
        $('<button/>').addClass("btn btn-outline-success").appendTo(div)
            .text("Water")
            .click(function() {
                runRandomTimes(1, 5, function() {
                    new VegShapes(that.world).moreWater();
                });
                that.showMessageAndRender("More Water");
            });

        $('<div/>').appendTo(div);
        $('<button/>').addClass("btn btn-outline-warning").appendTo(div)
            .text("Less Veg")
            .css('width', '100px')
            .click(function() {
                that.world.addVeg(-randomInt(1, 3));
                that.showMessageAndRender('Less vegetation');
            });
        $('<button/>').addClass("btn btn-outline-warning").appendTo(div)
            .text("Rain (terrain)")
            .click(function() { that.showMessageAndRender(that._lessRainTerrain()); });
        $('<button/>').addClass("btn btn-outline-warning").appendTo(div)
            .text("Water")
            .click(function() {
                runRandomTimes(1, 5, function() {
                    new VegShapes(that.world).lessWater();
                });
                that.showMessageAndRender("Less water");
            });

        $('<div/>').appendTo(div);
        $('<button/>').addClass("btn btn-outline-success").appendTo(div)
            .text("Move")
            .click(function() {
                that.showMessageAndRender(that._updateFormulaDec(
                    globalParams.penalties.moving, 0, 'Easier to move (penalty=', ')'));
            });
        $('<button/>').addClass("btn btn-outline-success").appendTo(div)
            .text("Breed")
            .click(function() { that.showMessageAndRender(that._updateFormulaDec(globalParams.penalties.birth, 0,
                'Easier to breed (penalty=', ')'))
            });
        $('<button/>').addClass("btn btn-outline-success").appendTo(div)
            .text("Max health")
            .click(function() { that.showMessageAndRender(that._maxHealthEasier()); });
        $('<button/>').addClass("btn btn-outline-success").appendTo(div)
            .text("Eat Veg")
            .click(function() { that.showMessageAndRender(that._maxVegEasier()); });

        $('<div/>').appendTo(div);
        $('<button/>').addClass("btn btn-outline-warning").appendTo(div)
            .text("Move")
            .click(function() { that.showMessageAndRender(that._updateFormulaInc(
                globalParams.penalties.moving, 'Harder to move (penalty=', ')'))
            });
        $('<button/>').addClass("btn btn-outline-warning").appendTo(div)
            .text("Breed")
            .click(function() { that.showMessageAndRender(that._breedHarder()); });
        $('<button/>').addClass("btn btn-outline-warning").appendTo(div)
            .text("Max health")
            .click(function() { that.showMessageAndRender(that._maxHealthHarder()); });
        $('<button/>').addClass("btn btn-outline-warning").appendTo(div)
            .text("Eat Veg")
            .click(function() { that.showMessageAndRender(that._maxVegHarder()); });
    }

    private _moreRainTerrain(): string {
        const vegShapes = new VegShapes(this.world);
        vegShapes.updateTerrain(true);
        return 'More rain (terrain)';
    }

    private _lessRainTerrain(): string {
        const vegShapes = new VegShapes(this.world);
        vegShapes.updateTerrain(false);
        return 'Less rain (terrain)';
    }

    private _addCreatures(): string {
        const cAmount = randomInt(2500, 8000);
        this.world.addCreatures(cAmount, false);
        return 'Adding ' + cAmount + ' creatures';
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

    private _maxVegEasier(): string {
        return this._updateFormulaInc(globalParams.rules.maxVegToEat,
            'Higher max veg to eat (', ')');
    }

    private _maxVegHarder(): string {
        return this._updateFormulaDec(globalParams.rules.maxVegToEat, 2,
            'Lower max veg to eat (', ')');
    }


}
