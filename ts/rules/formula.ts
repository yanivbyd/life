export class Formula {
    base: number;
    sizeCoef: number;

    constructor(base: number, sizeCoef: number) {
        this.base = base;
        this.sizeCoef = sizeCoef;
    }
    calc(size: number): number {
        return Math.round(this.base + this.sizeCoef * size);
    }

    describe(): string {
        return '' + this.base + ' + size*' + this.sizeCoef;
    }

}
