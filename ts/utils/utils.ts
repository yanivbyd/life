export function inRange(val: number, min: number, max: number) {
    return Math.min(Math.max(0, val), max);
}