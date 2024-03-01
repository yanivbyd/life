import { Cell } from './cell.js';

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
                // You can initialize the cells as needed
                this.matrix[i][j] = new Cell();
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

