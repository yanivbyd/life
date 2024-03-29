export function inRange(val: number, min: number, max: number) {
    return Math.min(Math.max(min, val), max);
}