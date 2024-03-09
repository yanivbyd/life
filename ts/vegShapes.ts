import { World } from './world.js';
import {randomBool, randomInt } from './utils/random.js';
import { inRange } from './utils/utils.js';

const INITIAL_RAIN_MIN = 5;
const INITIAL_RAIN_MAX = 24;
const MAX_RAIN = 20;

function f(x: number) {
    return Math.floor(x);
}
export class VegShapes {
    world: World;

    constructor(world: World) {
        this.world = world;
    }

    _generateMatrix() {
        const width = this.world.width;
        const height = this.world.height;
        const matrix: number[][] = [];
        for (let i = 0; i < width; i++) {
            matrix[i] = [];
            for (let j = 0; j < height; j++) {
                matrix[i][j] = 0;
            }
        }
        matrix[0][height-1] = randomInt(INITIAL_RAIN_MIN, INITIAL_RAIN_MAX);
        matrix[width-1][0] = randomInt(INITIAL_RAIN_MIN, INITIAL_RAIN_MAX);
        matrix[0][0] = randomInt(INITIAL_RAIN_MIN, INITIAL_RAIN_MAX);
        matrix[width-1][height-1] = randomInt(INITIAL_RAIN_MIN, INITIAL_RAIN_MAX);

        return matrix;
    }

    _diamondSquare(matrix: number[][]) {
        const width = this.world.width;
        const height = this.world.height;
        let chunkSize = width - 1;
        let randomFactor = INITIAL_RAIN_MAX;

        while (chunkSize > 1) {
            this._calculateSquare(matrix, chunkSize, randomFactor);
            this._calculateDiamond(matrix, chunkSize, randomFactor);
            chunkSize /= 2;
            randomFactor /= 2;
        }

        return matrix;
    }

    _calculateDiamond(matrix: number[][], chunkSize: number, randomFactor: number) {
        const half = chunkSize / 2;
        for (let y = 0; y < matrix.length; y += half) {
            for (let x = (y + half) % chunkSize; x < matrix.length; x += chunkSize) {
                const BOTTOM = matrix[f(y + half)] ? matrix[f(y + half)][f(x)] : null;
                const LEFT = matrix[f(y)][f(x - half)];
                const TOP = matrix[f(y - half)] ? matrix[f(y - half)][f(x)] : null;
                const RIGHT = matrix[f(y)][f(x + half)];
                const { count, sum } = [BOTTOM, LEFT, TOP, RIGHT].reduce(
                    (result, value) => {
                        if (isFinite(value) && value != null) {
                            result.sum += value;
                            result.count += 1;
                        }
                        return result;
                    },
                    { sum: 0, count: 0 }
                );
                matrix[f(y)][f(x)] = sum / count + randomInt(-randomFactor, randomFactor);
            }
        }
        return matrix;
    }

    _calculateSquare(matrix: number[][], chunkSize: number, randomFactor: number) {
        let sumComponents = 0;
        let sum = 0;
        for (let i = 0; i < matrix.length - 1; i += chunkSize) {
            for (let j = 0; j < matrix.length - 1; j += chunkSize) {
                const BOTTOM_RIGHT = matrix[f(j + chunkSize)]
                    ? matrix[f(j + chunkSize)][f(i + chunkSize)]
                    : null;
                const BOTTOM_LEFT = matrix[f(j + chunkSize)]
                    ? matrix[f(j + chunkSize)][i]
                    : null;
                const TOP_LEFT = matrix[f(j)][f(i)];
                const TOP_RIGHT = matrix[f(j)][f(i + chunkSize)];
                const { count, sum } = [
                    BOTTOM_RIGHT,
                    BOTTOM_LEFT,
                    TOP_LEFT,
                    TOP_RIGHT
                ].reduce(
                    (result, value) => {
                        if (isFinite(value) && value != null) {
                            result.sum += value;
                            result.count += 1;
                        }
                        return result;
                    },
                    { sum: 0, count: 0 }
                );
                matrix[f(j + chunkSize / 2)][f(i + chunkSize / 2)] =
                    sum / count + randomInt(-randomFactor, randomFactor);
            }
        }
    }

    _normalizeMatrix(matrix: number[][]) {
        const maxValue = matrix.reduce((max, row) => {
            return row.reduce((max, value) => Math.max(value, max));
        }, -Infinity);

        return matrix.map((row) => {
            return row.map((val) => val / maxValue);
        });
    }

    createTerrain(): void {
        for (var v=0;v<5;v++) {
            let matrix: number[][] = this._generateMatrix();
            matrix = this._diamondSquare(matrix);
            matrix = this._normalizeMatrix(matrix);

            for (let i = 0; i < this.world.width; i++) {
                for (let j = 0; j < this.world.height; j++) {
                    let amount = Math.round((matrix[i][j] * MAX_RAIN / 3) - 2);
                    if ((v % 2) == 0) { amount = -amount; }
                    this.world.matrix[i][j].addRain(inRange(amount, -8, 8));
                }
            }
        }
    }

    private _hasColor(canvasCtx: CanvasRenderingContext2D , x: number, y: number) {
        return canvasCtx.getImageData(x, y, 1, 1).data[3] == 255;
    }

}
