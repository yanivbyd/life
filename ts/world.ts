import { EatVegAction } from "./actions/eatVeg.js";
import { Cell } from "./cell.js";
import { Creature } from "./creature.js";
import { CycleContext } from "./cycle/cycleContext.js";
import { randomInt } from "./utils/random.js";
import { VegShapes } from "./vegShapes.js";
import {CreatureDefs, globalParams } from "./worldParams.js";

export class World {
    width: number;
    height: number;
    matrix: Cell[][];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;

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
        for (let i=0; i<100; i++) {
            for (let type=0;type<globalParams.creatures.length;type++) {
                const creatureDef: CreatureDefs = globalParams.creatures[type];

                const x = randomInt(0, this.width-1);
                const y = randomInt(0, this.height-1);

                if (!this.matrix[x][y].creature) {
                    this.matrix[x][y].creature = new Creature(
                        type,
                        globalParams.rules.creatureMaxHealth.calc(creatureDef.size),
                        creatureDef.size,
                        [
                            new EatVegAction()
                        ]
                    );
                }
            }
        }
    }
    cycle(): void {
        let cycleCtx: CycleContext = new CycleContext();
        cycleCtx.world = this;
        cycleCtx.rules = globalParams.rules;
        cycleCtx.penalties = globalParams.penalties;

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                this.matrix[i][j].cycle();
                if (this.matrix[i][j].creature) {
                    cycleCtx.creature = this.matrix[i][j].creature;
                    cycleCtx.cell = this.matrix[i][j];
                    cycleCtx.x = i;
                    cycleCtx.y = j;

                    cycleCtx.creature.cycle(cycleCtx);
                }
            }
        }
    }
}
window['World'] = World;

