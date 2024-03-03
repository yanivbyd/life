import { BreedDef } from "./actions/breedAction.js";
import { MoveDef } from "./actions/moveAction.js";
import { RGB } from "./rgb.js";
import { Formula } from "./rules/formula.js";
import { GameRules } from "./rules/gameRules.js";
import { Penalties } from "./rules/penalties.js";
import { randomInt } from "./utils/random.js";

export class RandomMinMax {
    min: number;
    max: number;
}
export class Environment {
    maxVeg: number;
    rain: RandomMinMax;
}

export class CreatureDefs {
    name: string;
    color: RGB;
    size: number;

    move: MoveDef;
    breed: BreedDef;
}
export class WorldParams {
    env: Environment;
    rules: GameRules;
    penalties: Penalties;
    creatures: CreatureDefs[];
};
export var globalParams: WorldParams = {
    env: {
        maxVeg: 120,
        rain: { min: 1, max: 3 },
    },
    rules: {
        creatureMaxHealth: new Formula(18, 4),
        maxVegToEat: new Formula(1, 1),
        deathChance: new Formula(1,0)
    },
    penalties: {
        breathing: new Formula(0.1, 0.7),
        eating: new Formula(0.3, 0.3),
        moving: new Formula(2, 0.1),
        birth: new Formula(3, 0.1)
    },
    creatures: [
        {
            name: 'red',
            color: new RGB(255, 0, 0),
            size: randomInt(6, 8),
            move: {
                chance: 50,
                minVegAmount: 5
            },
            breed: {
                chance: 50,
                minHealth: 18
            }
        },
        {
            name: 'blue',
            color: new RGB(0, 0, 255),
            size: randomInt(5, 8),
            move: {
                chance: 70,
                minVegAmount: 5
            },
            breed: {
                chance: 50,
                minHealth: 20
            }
        },
        {
            name: 'purple',
            color: new RGB(128, 0, 128),
            size: randomInt(5, 8),
            move: {
                chance: 70,
                minVegAmount: 5
            },
            breed: {
                chance: 50,
                minHealth: 20
            }
        },
        {
            name: 'yellow',
            color: new RGB(255, 255, 0),
            size: randomInt(5, 8),
            move: {
                chance: 70,
                minVegAmount: 5
            },
            breed: {
                chance: 50,
                minHealth: 20
            }
        },
        {
            name: 'brown',
            color: new RGB(165, 42, 42),
            size: randomInt(5, 8),
            move: {
                chance: 70,
                minVegAmount: 5
            },
            breed: {
                chance: 50,
                minHealth: 20
            }
        },
        {
            name: 'pink',
            color: new RGB(255, 192, 203),
            size: randomInt(5, 8),
            move: {
                chance: 70,
                minVegAmount: 5
            },
            breed: {
                chance: 50,
                minHealth: 20
            }
        },
    ]
};
