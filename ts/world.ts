import { Cell } from "./cell.js";
import { Creature } from "./creature.js";
import { CycleContext } from "./cycle/cycleContext.js";
import { Pos } from "./pos.js";
import { CycleStatsCounter } from "./stats/cycleStatsCounter.js";
import { assertNotNull } from "./utils/assert.js";
import { randomInt } from "./utils/random.js";
import { VegShapes } from "./vegShapes.js";
import { CreatureDNA } from './actions/dna.js';
import { globalParams } from "./worldParams.js";
import { CreatureDefs } from "./worldParamsDefs.js";
import { GlobalEvents } from "./globalEvents.js";

export class World {
    width: number;
    height: number;
    matrix: Cell[][];
    currentCycle: number;
    statsCounter: CycleStatsCounter;
    rainDelta: number;
    globalEvents: GlobalEvents;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.rainDelta = 0;
        this.currentCycle = 0;
        this.globalEvents = new GlobalEvents(this);

        this.matrix = [];
        for (let i = 0; i < width; i++) {
            this.matrix[i] = [];
            for (let j = 0; j < height; j++) {
                this.matrix[i][j] = new Cell();
            }
        }

        var vegShapes: VegShapes = new VegShapes(this);
        vegShapes.addShape(1, 3);

        this.addCreatures();
    }

    addCreatures(): void {
        var initialDNA: CreatureDNA[] = [];
        for (let type=0;type<globalParams.creatures.length;type++) {
            const creatureDef: CreatureDefs = globalParams.creatures[type];
            initialDNA.push(new CreatureDNA(creatureDef.move, creatureDef.breed));
        }

        for (let i=0; i<300; i++) {
            for (let type=0;type<globalParams.creatures.length;type++) {
                const creatureDef: CreatureDefs = globalParams.creatures[type];

                const x = randomInt(0, this.width-1);
                const y = randomInt(0, this.height-1);
                const x2 = (x > 0) ? x-1: x+1;

                assertNotNull(this.matrix[x][y]);
                assertNotNull(this.matrix[x2][y]);
                this.matrix[x][y].creature = new Creature(
                    type,
                    globalParams.rules.creatureMaxHealth.calc(creatureDef.size),
                    creatureDef.size,
                    initialDNA[type]
                );
                this.matrix[x2][y].creature = new Creature(
                    type,
                    globalParams.rules.creatureMaxHealth.calc(creatureDef.size),
                    creatureDef.size,
                    initialDNA[type]
                );
            }
        }
    }
    cycle(): void {
        this.currentCycle++;
        this.statsCounter = new CycleStatsCounter();

        let cycleCtx: CycleContext = new CycleContext();
        cycleCtx.world = this;
        cycleCtx.rules = globalParams.rules;
        cycleCtx.penalties = globalParams.penalties;
        cycleCtx.statsCounter = this.statsCounter;

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                this.matrix[i][j].cycle(this);
                if (this.matrix[i][j].creature) {
                    cycleCtx.creature = this.matrix[i][j].creature;
                    cycleCtx.cell = this.matrix[i][j];
                    cycleCtx.x = i;
                    cycleCtx.y = j;

                    cycleCtx.creature.cycle(cycleCtx);
                }
            }
        }
        this.globalEvents.cycle();
    }

    getNeighbouringPositions(x: number, y: number): Pos[] {
        let result: Pos[] = [];
        for (var i=x-1;i<=x+1;i++) {
            for (var j=y-1;j<=y+1;j++) {
                if (i>=0 && i<this.width && j>=0 && j<this.height) {
                    result.push(new Pos(i, j));
                }
            }
        }
        return result;
    }

    ensureNoVegBeyondMaxVeg() {
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                const cell = this.matrix[i][j];
                cell.veg = Math.min(cell.veg, globalParams.env.maxVeg);
            }
        }
    }

}
window['World'] = World;

