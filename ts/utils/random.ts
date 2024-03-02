
export function randomInt(min: number, max: number): number {
    if (min == max) { return min; }
    return min + Math.round(Math.random() * (max - min + 1));
}

export function getRandomArrItem(array: any[]): any | null {
    if (array.length === 0) {
        return null;
    }
    if (array.length === 1) {
        return array[0];
    }
    const index = randomInt(0, array.length);
    return array[index];
}

export function chance(chance: number): boolean {
    return randomInt(0, 100) > chance;
}