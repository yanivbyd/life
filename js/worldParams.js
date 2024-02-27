worldParams = {
    rules: {
        creatureMaxHealth: "18 + size * 4",  /* maximum health points a creature can have. When a creature reaches 0 or negative health it dies */
        eating: "1 + size * 1",   /* Amount of vegetation eaten from a cell per turn. The actual amount eaten will not exceed creature's maxHealth nor the vegetation amount in the cell */
        penalties: {
            breathing: "2 + 0.5 * size * 1",  /* Fixed creature penalty on each turn, regardless of what it does */
            moving: 6,  /* Penalty for moving to another empty cell */
            breed: 3,   /* Penalty of a parent for breeding. Breeding is done by 2 parents */
            babyPenalty: 3,  /* Penalty of a baby for being bord. The health of the baby is taken from its parents */
            attack: 3,   /* Penalty for actually attacking */
            attackIntent: 1  /* Penalty for deciding to attack and looking for opponents */
        },
        randomDeathChance: 1,
        mutationChance: 5,  /* 0-100 chance for gene single change on birth */
        switchGeneChance: 30, /* 0-100 chance while copying dna to switch to the other parent's dna */
        attackSuccess: 95, /* the percentage of successful attacks */
        addCreatures: {
            amount: 4000,       /* Amount of creatures by types added when the game starts */
            initialHealth: "10 + size * random(1,5)", /* health to be given to a creature when the game starts, can't excceed maxHealth */
        }
    },
    environment: {
        vegMaxAmount: 60,   /* max amount of vegetation per cell */
        rain: 1            /* rain increases vegetation count per cell */
    },
    rendering: {
        creatures: [    /* colors of creatures */
            [255, 0, 0],
            [0, 0, 255],
            [255, 165, 0],
            [128, 0, 128],
            [255, 255, 0],
            [150, 75, 0]
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
        * attack action
        *      - When attacking, an adjacent opponent (of a different type) is first selected
        *      - If the attack is successful (based on a combo of size & health) an amount of the attacker's size is
        *        reduced from the defender's health and it dies if 0 or lower.
        *      - If the opponent dies, the attacker moves to take its place
    */
    creatures: [
        {
            name: "red",
            size: random(1,12),
            actions: [
                { t: 'eat', p: 100 },
                { t: 'move', p: random(10,15), cellVegAmountToMove: random(4,8) },
                { t: 'breed', p: random(1,60), minHealth: random(5,15) },
                { t: 'attack', p: random(1,60), minHealth: random(5,10), opponentMaxHealth: random(5,10) }
            ]
        },
        {
            name: "blue",
            size: random(1,12),
            actions: [
                { t: 'eat', p: 100 },
                { t: 'move', p: random(10,15), cellVegAmountToMove: random(4,8) },
                { t: 'breed', p: random(1,60), minHealth: random(5,15) },
                { t: 'attack', p: random(1,60), minHealth: random(5,10), opponentMaxHealth: random(5,10) }
            ]
        },
        {
            name: "orange",
            size: random(1,12),
            actions: [
                { t: 'eat', p: 100 },
                { t: 'move', p: random(10,15), cellVegAmountToMove: random(4,8) },
                { t: 'breed', p: random(1,60), minHealth: random(5,15) },
                { t: 'attack', p: random(1,60), minHealth: random(5,10), opponentMaxHealth: random(5,10) }
            ]
        },
        {
            name: "purple",
            size: random(1,12),
            actions: [
                { t: 'eat', p: 100 },
                { t: 'move', p: random(10,15), cellVegAmountToMove: random(4,8) },
                { t: 'breed', p: random(1,60), minHealth: random(5,15) },
                { t: 'attack', p: random(1,60), minHealth: random(5,10), opponentMaxHealth: random(5,10) }
            ]
        },
        {
            name: "yellow",
            size: random(1,12),
            actions: [
                { t: 'eat', p: 100 },
                { t: 'move', p: random(10,15), cellVegAmountToMove: random(4,8) },
                { t: 'breed', p: random(1,60), minHealth: random(5,15) },
                { t: 'attack', p: random(1,60), minHealth: random(5,10), opponentMaxHealth: random(5,10) }
            ]
        },
        {
            name: "brown",
            size: random(1,12),
            actions: [
                { t: 'eat', p: 100 },
                { t: 'move', p: random(10,15), cellVegAmountToMove: random(4,8) },
                { t: 'breed', p: random(1,60), minHealth: random(5,15) },
                { t: 'attack', p: random(1,60), minHealth: random(5,10), opponentMaxHealth: random(5,10) }
            ]
        }
    ],
}

module.exports = worldParams