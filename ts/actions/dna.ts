import { CreatureAction } from "../creatureAction.js";
import {randomBool, randomInt } from "../utils/random.js";
import {AttackAction, AttackDef } from "./attackAction.js";
import {BreedAction, BreedDef } from "./breedAction.js";
import { EatVegAction } from "./eatVeg.js";
import {MoveAction, MoveDef} from "./moveAction.js";
import {EatDef} from "./eatVeg";

export class CreatureDNA {
    size: number;
    eatDef: EatDef;
    moveDef: MoveDef;
    breedDef: BreedDef;
    attackDef: AttackDef;

    actions: CreatureAction[];

    constructor(size: number, eatDef: EatDef, moveDef: MoveDef, breedDef: BreedDef, attackDef: AttackDef) {
        this.size = size;
        this.eatDef = eatDef;
        this.moveDef = moveDef;
        this.breedDef = breedDef;
        this.attackDef = attackDef;
        this.actions = [
            new EatVegAction(this.eatDef),
            new MoveAction(this.moveDef),
            new BreedAction(this.breedDef),
            new AttackAction(this.attackDef)
        ]
    }

    toCacheKey(): string {
        const keyParts: number[] = [];
        keyParts.push(this.size);
        keyParts.push(this.moveDef.chance);
        keyParts.push(this.moveDef.minVegAmount);
        keyParts.push(this.breedDef.chance);
        keyParts.push(this.breedDef.minHealth);
        keyParts.push(this.attackDef.chance);

        return keyParts.map(item => item.toString()).join(',');
    }

    mutate(): CreatureDNA {
        var eatDef: EatDef = {
            isWaterCreature: this.eatDef.isWaterCreature
        };
        var moveDef: MoveDef = {
            chance: this.moveDef.chance,
            minVegAmount: this.moveDef.minVegAmount
        };
        var breedDef: BreedDef = {
            chance: this.breedDef.chance,
            minHealth: this.breedDef.minHealth
        };
        var attackDef: AttackDef = {
            chance: this.attackDef.chance
        };
        var newSize = this.size;
        
        const randomGene = randomInt(1, 12);
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
            case 9:
            case 10:
                newSize = (randomGene == 9 ? this.size + 1 : Math.max(1, this.size - 1));
            case 11:
            case 12:
                attackDef.chance = this._mutateChanceGene(this.attackDef.chance, randomGene == 11);
                break;
        }

        const newDNA = new CreatureDNA(newSize, eatDef, moveDef, breedDef, attackDef);
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

