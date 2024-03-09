import { AttackDef } from "./actions/attackAction.js";
import { BreedDef } from "./actions/breedAction.js";
import { MoveDef } from "./actions/moveAction.js";
import { RGB } from "./rgb.js";
import { Formula } from "./rules/formula.js";
import { GameRules } from "./rules/gameRules.js";
import { Penalties } from "./rules/penalties.js";
export class RandomMinMax {
    min: number;
    max: number;
}
export class Environment {
    maxVeg: number;
    extraRain: number;
}

export class CreatureDefs {
    name: string;
    color: RGB;
    size: number;

    move: MoveDef;
    breed: BreedDef;
    attack: AttackDef;
}
export class WorldParams {
    env: Environment;
    rules: GameRules;
    penalties: Penalties;
    creatures: CreatureDefs[];
};
