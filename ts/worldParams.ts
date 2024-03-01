import { RGB } from "./rgb.js";
import { Formula } from "./rules/formula.js";
import { GameRules } from "./rules/gameRules.js";
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
}
export class WorldParams {
    env: Environment;
    rules: GameRules;
    creatures: CreatureDefs[];
};
export var globalParams: WorldParams = {
    env: {
        maxVeg: 200,
        rain: { min: 1, max: 4},
    },
    rules: {
        creatureMaxHealth: new Formula(18, 4),
        maxVegToEat: new Formula(1, 1)
    },
    creatures: [{
        name: 'red',
        color: new RGB(255, 0, 0),
        size: randomInt(6, 8)
    }]
};
