worldParams = {
    rules: {
        creature: {
            maxHealth: "18 + size * 2"  /* maximum health points a creature can have. When a creature reaches 0 or negative health it dies */
        },
        addCreatures: {
            amount: 1000,       /* Amount of creatures by types added when the game starts */
            initialHealth: "10 + size * 1.5", /* health to be given to a creature when the game starts, can't excceed maxHealth */
        },
        eating: "3 + size * 1",   /* Amount of vegetation eaten from a cell per turn. The actual amount eaten will not exceed creature's maxHealth nor the vegetation amount in the cell */
        penalties: {
            breathing: "1 + size * 0.8",  /* Fixed creature penalty on each turn, regardless of what it does */
            moving: 3,  /* Penalty for moving to another empty cell */
            breed: 2,   /* Penalty of a parent for breeding. Breeding is done by 2 parents */
            babyPenalty: 2  /* Penalty of a baby for being bord. The health of the baby is taken from its parents */
        },
        mutationChance: 10,  /* 0-100 chance for gene single change on birth */
        switchGeneChance: 30, /* 0-100 chance while copying dna to switch to the other parent's dna */
    },
    environment: {
        vegMaxAmount: 60,      /* max amount of vegetation per cell */
        rain: 2             /* rain increases vegetation count per cell */
    },
    areas: [
        {
            type: 'multiAreas',
            shapes: 'rnd(1,4)',
            area: {
                type: 'roundedRect',
                x: 'rnd(0, 100)', y: 'rnd(0, 50)', width: 'rnd(200, 280)', height: 'rnd(50, 150)', cornerRadius: 'rnd(10, 40)'
            },
            environment: {
                vegMaxAmount: 90,
                rain:3
            }
        },
        {
            type: 'multiAreas',
            shapes: 'rnd(3,6)',
            area: {
                type: 'circle',
                x: 'rnd(50, 450)', y: 'rnd(40, 420)', radius: 'rnd(5, 95)'
            },
            environment: {
                vegMaxAmount: 90,
                rain:3
            }
        },
        {
            name: 'hearts',
            type: 'multiAreas',
            shapes: 'rnd(5,8)',
            area: {
                type: 'polygon',
                arcRadius: 'rnd(10, 12)',
                dx: 'rnd(0, 250)', dy: 'rnd(0, 300)',
                points: [
                    {x: 65, y: 90},
                    {x: 120, y: 0},
                    {x: 65, y: 25},
                    {x: 10, y: 0},
                ],
            },
            environment: {
                vegMaxAmount: 90,
                rain: 5
            }
        }
    ],
    rendering: {
        creatures: [    /* colors of creatures */
            [255, 0, 0],
            [0, 0, 255],
            [255, 165, 0],
            [128, 0, 128]
        ]
    },

    /*
        Creature params consist of:
        * size - The size of the creature (1-10).
        *        An increases size increses # vegetations eaten per turn as well as the creatures max health,
        *        but increases the creature's penalties a well
        * actions - a list of actions a creature takes each turn. The order is important
        * eat action
        *     - eating vegetation in the amount of rules.eating. Amount cannot exceed creature's maxHealth or the
        *       amount of vegetation in the cell
        *     - p: chance of actually eating in this turn
        * breed action
        *      - A creature can seek for another creatures of the same type as its nearest neighbour and together they breed
        *        The baby will be places in an empty cell neighbouring the initiating creature. If no such cell is found the breeding does not take place
        *        Each parent gives half its health for the baby, and three of the suffer penalty for breeding or being born
        *        The params of the baby is a random mix of its parents params + a possible mutation
        *      - minHealth: minimun creature health to initiate or accept breeding
        *                   breeding will not happen if a creature should die because of breeding
        *      - p: chance of breeding after all prerequisites are met
        * move action
        *      - A creature can move to a neighbouring cell with max vegetation. The neightbouring cell must have more vegetation
        *        than the current cell
        *      - cellVegAmountToMove: the maximum amount of vegetation in a cell for migrating. If the cell vegetation is higher
        *                             no move will happen
        *      - p: chance of moving after all prerequisites are met
    */
    creatures: [
        {
            name: "red",
            size: 10,
            actions: [
                { t: 'eat', p: 100 },
                { t: 'move', p: 100, cellVegAmountToMove: 4 },
                { t: 'breed', p: 100, minHealth: 25 }
            ]
        },
        {
            name: "blue",
            size: 10,
            actions: [
                { t: 'eat', p: 100 },
                { t: 'move', p: 100, cellVegAmountToMove: 4 },
                { t: 'breed', p: 100, minHealth: 25 }
            ]
        },
        {
            name: "orange",
            size: 10,
            actions: [
                { t: 'eat', p: 100 },
                { t: 'move', p: 100, cellVegAmountToMove: 4 },
                { t: 'breed', p: 100, minHealth: 25 }
            ]
        },
        {
            name: "purple",
            size: 10,
            actions: [
                { t: 'eat', p: 100 },
                { t: 'move', p: 100, cellVegAmountToMove: 4 },
                { t: 'breed', p: 100, minHealth: 25 }
            ]
        }
    ],
}

module.exports = worldParams