import { RGB } from "./rgb.js";
import { Formula } from "./rules/formula.js";
import { randomInt } from "./utils/random.js";
import { WorldParams } from "./worldParamsDefs.js";

export var globalParams: WorldParams = {
    env: {
        maxVeg: randomInt(30,35),
        extraRain: 0,
    },
    rules: {
        creatureMaxHealth: new Formula(14, 4),
        maxVegToEat: new Formula(2, 1),
        deathChance: new Formula(3, -0.2),
        mutationChance: 1,
        attackHit: new Formula(15, 2),
        attackSuccessChange: new Formula(70, 0.8),
        attackSuccessChangeForSmallerCreature: 30,
        reverseVegInCell: 15
    },
    penalties: {
        breathing: new Formula(0.1, 0.7),
        eating: new Formula(0.3, 0.3),
        moving: new Formula(2, 0.1),
        birth: new Formula(3, 0.1),
        attack: new Formula(3, 0.1)
    },
    creatures: [
        {
            name: 'יניב',
            color: new RGB(255, 0, 0),
            size: randomInt(6, 8),
            eat: { vegIsPoison: false },
            move: {
                chance: 50,
                minVegAmount: 25
            },
            breed: {
                chance: 50,
                minHealth: 18
            },
            attack: {
                chance: randomInt(20,70)
            }
        },
        {
            name: 'דגים',
            color: new RGB(88, 150, 220),
            size: randomInt(5, 8),
            eat: { vegIsPoison: true },
            move: {
                chance: 20,
                minVegAmount: 5
            },
            breed: {
                chance: 20,
                minHealth: 20
            },
            attack: {
                chance: randomInt(20,70)
            }
        },
        {
            name: 'נמלים',
            color: new RGB(128, 0, 128),
            size: randomInt(5, 8),
            eat: { vegIsPoison: false },
            move: {
                chance: 70,
                minVegAmount: 25
            },
            breed: {
                chance: 50,
                minHealth: 20
            },
            attack: {
                chance: randomInt(20,70)
            }
        },
        {
            name: 'טלי',
            color: new RGB(255, 255, 0),
            size: randomInt(5, 8),
            eat: { vegIsPoison: false },
            move: {
                chance: 70,
                minVegAmount: 25
            },
            breed: {
                chance: 50,
                minHealth: 20
            },
            attack: {
                chance: randomInt(20,70)
            }
        },
        {
            name: 'קופים',
            color: new RGB(165, 42, 42),
            size: randomInt(5, 8),
            eat: { vegIsPoison: false },
            move: {
                chance: 70,
                minVegAmount: 25
            },
            breed: {
                chance: 50,
                minHealth: 20
            },
            attack: {
                chance: randomInt(20,70)
            }
        },
        {
            name: 'עידן',
            color: new RGB(255, 165, 0),
            size: 3,
            eat: { vegIsPoison: false },
            move: {
                chance: 80,
                minVegAmount: 24
            },
            breed: {
                chance: 50,
                minHealth: 20
            },
            attack: {
                chance: randomInt(20,70)
            }
        },
        {
            name: 'צפרדעים',
            color: new RGB(255, 192, 203),
            size: randomInt(2, 5),
            eat: { vegIsPoison: false },
            move: {
                chance: 80,
                minVegAmount: 24
            },
            breed: {
                chance: 50,
                minHealth: 20
            },
            attack: {
                chance: randomInt(20,70)
            }
        },
        {
            name: 'עכברים',
            color: new RGB(255, 105, 180),
            size: randomInt(2, 5),
            eat: { vegIsPoison: false },
            move: {
                chance: 80,
                minVegAmount: 24
            },
            breed: {
                chance: 50,
                minHealth: 20
            },
            attack: {
                chance: randomInt(20,70)
            }
        },
        {
            name: 'הילה',
            color: new RGB(221, 160, 221),
            size: randomInt(2, 5),
            eat: { vegIsPoison: false },
            move: {
                chance: 80,
                minVegAmount: 24
            },
            breed: {
                chance: 50,
                minHealth: 20
            },
            attack: {
                chance: randomInt(20,70)
            }
        },
        {
            name: 'איתי',
            color: new RGB(106, 90, 205),
            size: 3,
            eat: { vegIsPoison: false },
            move: {
                chance: 80,
                minVegAmount: 24
            },
            breed: {
                chance: 50,
                minHealth: 20
            },
            attack: {
                chance: randomInt(20,70)
            }
        }
    ]
};
