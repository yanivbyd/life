export class Formula {
    base: number;
    sizeCoef: number;

    constructor(base: number, sizeCoef: number) {
        this.base = base;
        this.sizeCoef = sizeCoef;
    }
    calc(size: number): number {
        return this.base + this.sizeCoef * size;
    }
}