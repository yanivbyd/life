import { CountColumn } from "./stats/countColumn.js";
import { NameColumn } from "./stats/nameColumn.js";
import { StatColumn } from "./stats/statColumn.js";
import { StatsRow } from "./stats/statsRow.js";
import { World } from "./world.js";
import { globalParams } from "./worldParams.js";

export class TableRenderer {
    world: World;
    thead: JQuery;
    tbody: JQuery;

    columns: StatColumn[];
    rows: StatsRow[];

    constructor(table: HTMLTableElement, world: World) {
        this.world = world;
        this.columns = [
            new NameColumn(),
            new CountColumn()
        ];

        this.thead = $('<thead/>').appendTo($(table));
        const theadTR = $('<tr/>').appendTo(this.thead);
        for (let i=0;i<this.columns.length;i++) {
            $('<td/>').text(this.columns[i].getTitle()).appendTo(theadTR);
        }
        this.tbody = $('<tbody/>').appendTo($(table));
        this.rows = [];

        for (let type=0;type<globalParams.creatures.length;type++) {
            const tr = $('<tr/>').appendTo(this.tbody).attr('id', "creature_" + globalParams.creatures[type].name);
            var tds: JQuery[] = [];
            for (let i=0;i<this.columns.length;i++) {
                tds.push($('<td/>').appendTo(tr));
            }
            this.rows.push({
                tr: tr,
                tds: tds,
                type: type,
                def: globalParams.creatures[type]
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
    }
}
window['TableRenderer'] = TableRenderer;
