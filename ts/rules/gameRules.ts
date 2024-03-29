import { Formula } from "./formula";

export class GameRules {
    creatureMaxHealth: Formula;
    maxVegToEat: Formula;
    deathChance: Formula;
    mutationChance: number;
    attackSuccessChange: Formula;
    attackSuccessChangeForSmallerCreature: number;
    attackHit: Formula;
    reverseVegInCell: number;
}