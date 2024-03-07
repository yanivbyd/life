import { RGB } from "./rgb.js";
import { Formula } from "./rules/formula.js";
import { randomInt } from "./utils/random.js";
import { WorldParams } from "./worldParamsDefs.js";

export var globalParams: WorldParams = {
    env: {
        maxVeg: randomInt(30,35),
        rain: 1,
    },
    rules: {
        creatureMaxHealth: new Formula(14, 4),
        maxVegToEat: new Formula(2, 1),
        deathChance: new Formula(3, -0.2),
        mutationChance: 1
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
        {
            name: 'orange',
            color: new RGB(255, 165, 0),
            size: randomInt(2, 5),
            move: {
                chance: 80,
                minVegAmount: 4
            },
            breed: {
                chance: 50,
                minHealth: 20
            }
        },
    ]
};
