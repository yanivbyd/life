import { AttackGeneColumn } from "./stats/attackGeneColumn.js";
import { BreedGeneColumn } from "./stats/breedGeneColumn.js";
import { CountColumn } from "./stats/countColumn.js";
import { CycleStatColumn } from "./stats/cycleStatColumn.js";
import { HealthColumn } from "./stats/healthColumn.js";
import { NameColumn } from "./stats/nameColumn.js";
import { SizeColumn } from "./stats/sizeColumn.js";
import { StatColumn } from "./stats/statColumn.js";
import { StatsRow } from "./stats/statsRow.js";
import { VegCountColumn } from "./stats/vegColumn.js";
import { World } from "./world.js";
import { globalParams } from "./worldParams.js";

export class TableRenderer {
    world: World;
    thead: JQuery;
    tbody: JQuery;

    columns: StatColumn[];
    countColumn: CountColumn;
    rows: StatsRow[];
    
    rulesTable: JQuery;

    constructor(statsTable: HTMLTableElement, rulesTable: HTMLTableElement, world: World) {
        this.rulesTable = $(rulesTable);
        this.world = world;
        this.countColumn = new CountColumn();
        this.columns = [
            new NameColumn(),
            this.countColumn,
            new SizeColumn(),
            new VegCountColumn(),
            new HealthColumn(),
            new BreedGeneColumn(),
            new AttackGeneColumn(),
            new CycleStatColumn('new mutations','mutation'),
            new CycleStatColumn('kills','kill'),
            new CycleStatColumn('births','birth'),
            new CycleStatColumn('deaths','death')
        ];

        this.thead = $('<thead/>').appendTo($(statsTable));
        const theadTR = $('<tr/>').appendTo(this.thead);
        for (let i=0;i<this.columns.length;i++) {
            $('<td/>').text(this.columns[i].getTitle()).appendTo(theadTR);
        }
        this.tbody = $('<tbody/>').appendTo($(statsTable));
        this.rows = [];

        for (let type=0;type<globalParams.creatures.length;type++) {
            const creatureDef = globalParams.creatures[type];
            const tr = $('<tr/>').appendTo(this.tbody).attr('id', "creature_" + creatureDef.name);
            var tds: JQuery[] = [];
            for (let i=0;i<this.columns.length;i++) {
                tds.push($('<td/>')
                    .appendTo(tr)
                    .css('background-color', 'rgba(' + creatureDef.color.red + ','
                        + creatureDef.color.green + ',' + creatureDef.color.blue + ',255)')
                );
            }
            this.rows.push({
                tr: tr,
                tds: tds,
                type: type,
                def: creatureDef
            });
        }
    }

    render(): void {
        for (var c=0;c<this.columns.length;c++) {
            this.columns[c].onCycle(this.world);
        }
        for(var i=0;i<this.world.width-1;i++) {
            for(var j=0;j<this.world.height;j++) {
                for (var c=0;c<this.columns.length;c++) {
                    this.columns[c].onCell(this.world.matrix[i][j]);
                }
            }
        }

        for(var i=0;i<this.rows.length;i++) {
            for (var j=0;j<this.columns.length;j++) {
                const row: StatsRow = this.rows[i];
                row.tds[j].text(this.columns[j].getValue(this.world, row.type, row.def));
            }
        }

        this._sortByCounts();
    }

    private _sortByCounts() {
        var addedTypes: number[] = [];
        var lastTr :JQuery = null;
        for (var i=0;i<this.rows.length;i++) {
            const lowestType: number = this._getLowestType(addedTypes);
            if (i==0) {
                this.tbody.append(this.rows[lowestType].tr);
            } else {
                lastTr.before(this.rows[lowestType].tr);
            }
            lastTr = this.rows[lowestType].tr;
            addedTypes.push(lowestType);
        }
    }

    private _getLowestType(addedTypes: number[]): number {
        var lowestCount: number = 9007199254740991;
        var lowestType: number = -1;

        for (var type=0;type<this.rows.length;type++) {
            const count = this.countColumn.counts[type];
            if (addedTypes.indexOf(type) == -1 && count < lowestCount) {
                lowestCount = count;
                lowestType = type;
            }
        }

        return lowestType;
    }
    
    renderRulesTable() {
        this.rulesTable.empty();
        const theadTR = $('<tr/>').appendTo($('<thead/>').appendTo(this.rulesTable));
        theadTR
            .append($('<td/>').text('Parameter'))
            .append($('<td/>').text('Value'))
            .append($('<td/>').text('Description'));
        
        const tbody = $('<tbody/>').appendTo(this.rulesTable);
        $('<tr/>')
            .append($('<td/>').text('Max creature health'))
            .append($('<td/>').text(globalParams.rules.creatureMaxHealth.describe()))
            .append($('<td/>').text('The max health a creature can have'))
            .appendTo(tbody);
        $('<tr/>')
            .append($('<td/>').text('Max veg to eat'))
            .append($('<td/>').text(globalParams.rules.maxVegToEat.describe()))
            .append($('<td/>').text('The max vegetable a creature can eat in a turn'))
            .appendTo(tbody);
        $('<tr/>')
            .append($('<td/>').text('Chance to die'))
            .append($('<td/>').text(globalParams.rules.deathChance.describe()))
            .append($('<td/>').text('A chance of a creature [0-100] each turn to die'))
            .appendTo(tbody);
        $('<tr/>')
            .append($('<td/>').text('Mutation chance'))
            .append($('<td/>').text(globalParams.rules.mutationChance))
            .append($('<td/>').text('A chance [0-100] for a birth to mutate parent DNA'))
            .appendTo(tbody);
        $('<tr/>')
            .append($('<td/>').text('Attack success rate'))
            .append($('<td/>').text(globalParams.rules.attackSuccessChange.describe()))
            .append($('<td/>').text('A chance [0-100] to win an attack, size in the formula is the size difference between attacker and defender'))
            .appendTo(tbody);
        $('<tr/>')
            .append($('<td/>').text('Attack success rate for smaller creatures'))
            .append($('<td/>').text(globalParams.rules.attackSuccessChangeForSmallerCreature))
            .append($('<td/>').text('A chance [0-100] to win an attack for smaller creatures'))
            .appendTo(tbody);
        $('<tr/>')
            .append($('<td/>').text('Attack hit count'))
            .append($('<td/>').text(globalParams.rules.attackHit.describe()))
            .append($('<td/>').text('Attack hit count, size in the formula is the size difference between attacker and defender'))
            .appendTo(tbody);
        $('<tr/>')
            .append($('<td/>').text('Breathing penalty'))
            .append($('<td/>').text(globalParams.penalties.breathing.describe()))
            .append($('<td/>').text('The cost in health just to breathe'))
            .appendTo(tbody);
        $('<tr/>')
            .append($('<td/>').text('Eating penalty'))
            .append($('<td/>').text(globalParams.penalties.eating.describe()))
            .append($('<td/>').text('The cost in health to eat'))
            .appendTo(tbody);
        $('<tr/>')
            .append($('<td/>').text('Birth penalty'))
            .append($('<td/>').text(globalParams.penalties.birth.describe()))
            .append($('<td/>').text('The cost in health to give birth'))
            .appendTo(tbody);
        $('<tr/>')
            .append($('<td/>').text('Attack penalty'))
            .append($('<td/>').text(globalParams.penalties.attack.describe()))
            .append($('<td/>').text('Penalty for attacking'))
            .appendTo(tbody);
    }
}
window['TableRenderer'] = TableRenderer;

