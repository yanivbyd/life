import { CreatureAction } from "../creatureAction.js";
import { randomInt } from "../utils/random.js";
import {BreedAction, BreedDef } from "./breedAction.js";
import { EatVegAction } from "./eatVeg.js";
import {MoveAction, MoveDef} from "./moveAction.js";

export class CreatureDNA {
    moveDef: MoveDef;
    breedDef: BreedDef;

    actions: CreatureAction[];

    constructor(moveDef: MoveDef, breedDef: BreedDef) {
        this.moveDef = moveDef;
        this.breedDef = breedDef;
        this.actions = [
            new EatVegAction(),
            new MoveAction(this.moveDef),
            new BreedAction(this.breedDef)
        ]
    }

    toCacheKey(): string {
        const keyParts: number[] = [];
        keyParts.push(this.moveDef.chance);
        keyParts.push(this.moveDef.minVegAmount);
        keyParts.push(this.breedDef.chance);
        keyParts.push(this.breedDef.minHealth);

        return keyParts.map(item => item.toString()).join(',');
    }

    mutate(): CreatureDNA {
        var moveDef: MoveDef = {
            chance: this.moveDef.chance,
            minVegAmount: this.moveDef.minVegAmount
        };
        var breedDef: BreedDef = {
            chance: this.breedDef.chance,
            minHealth: this.breedDef.minHealth
        };
        
        const randomGene = randomInt(1, 8);
        switch (randomGene) {
            case 1:
            case 2:
                moveDef.chance = this._mutateChanceGene(this.moveDef.chance, randomGene == 1);
                break;
            case 3:
            case 4:
                moveDef.minVegAmount = this._mutateGene(this.moveDef.minVegAmount, randomGene == 3)
                break;
            case 5:
            case 6:
                breedDef.chance = this._mutateChanceGene(this.breedDef.chance, randomGene == 5);
                break;
            case 7:
            case 8:
                breedDef.minHealth = this._mutateGene(this.breedDef.minHealth, randomGene == 7)
                break;
        }

        const newDNA = new CreatureDNA(moveDef, breedDef);
        const dnaFromCache = fromDNACache(newDNA.toCacheKey());
        if (dnaFromCache) {
            return dnaFromCache;
        }
        addToDNACache(newDNA);
        return newDNA;
    }

    private _mutateChanceGene(chance: number, increment: boolean): number {
        return Math.min(100, Math.max(0, increment ? chance + 1 : chance - 1));
    }

    private _mutateGene(value: number, increment: boolean): number {
        return Math.max(0, increment ? value + 1 : value - 1);
    }

}

export const DNACache: { [key: string]: CreatureDNA } = {};

export function addToDNACache(dna: CreatureDNA) {
    DNACache[dna.toCacheKey()] = dna;
}

export function fromDNACache(key: string) {
    return DNACache[key];
}

function _mutateCacheGene(chance: number): number {
    throw new Error("Function not implemented.");
}
