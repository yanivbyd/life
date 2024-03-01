import { CycleContext } from "./cycle/cycleContext";

export interface CreatureAction {
    // Method to calculate the area
    cycle(ctx: CycleContext): void;
}