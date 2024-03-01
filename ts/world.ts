import { Cell } from "./cell.js";
import { randomInt } from "./utils/random.js";
import { VegShapes } from "./vegShapes.js";
import { globalParams } from "./worldParams.js";

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
    }

    addCreatures(): void {
        for (let i=0; i<100; i++) {
            for (let type=0;type<globalParams.creatues.length-1;type++) {
                // const creatureDef: CreatureDefs = globalParams.creatues[type];

                const x = randomInt(0, this.width);
                const y = randomInt(0, this.height);

                // if (!this.matrix[x][y].creature) {
                //     this.matrix[x][y].creature = new Creature(type,
                //         globalParams.rules.creatureMaxHealth.calc(creatureDef.size),
                //         creatureDef.size,
                //         []
                //     );
                // }
            }
        }
    }
    cycle(): void {
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                this.matrix[i][j].cycle();
            }
        }
    }
}
window['World'] = World;

