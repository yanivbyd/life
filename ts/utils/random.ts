
export function randomInt(min: number, max: number): number {
    if (min == max) { return min; }
    return min + Math.floor(Math.random() * (max - min + 1));
}

export function getRandomArrItem(array: any[]): any | null {
    if (array.length === 0) {
        return null;
    }
    return array[randomInt(0, array.length-1)];
}

export function checkChance(chance: number): boolean {
    const val = randomInt(0, 100);
    return val <= chance;
}