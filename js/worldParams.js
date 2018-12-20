worldParams = {
    veg: {
        maxAmount: 20,
        rain: 1
    },
    creature: {
        "s": { initialHealth: 10, maxHealth: 20 },
        "m": { initialHealth: 20, maxHealth: 40 },
        "l": { initialHealth: 30, maxHealth: 60 },
    },
    addCreatures: {
        amount: 1000
    },
    eating: { "s": 4, "m": 6, "l": 7 },
    penalties: {
        breathing: { "s": 2, "m": 2.7, "l": 3.5 },
        moving: 3,
        breed: 2,
        babyPenalty: 2
    },
    mutationChance: 1,
    rendering: {
        creatures: [
            [255, 0, 0],
            [0, 0, 255],
            [224, 165, 29],
            [87, 13, 11]
        ]
    },

    creatures: [
        {
            name: "red",
            size: "s",
            actions: [
                { t: 'eat', p: 100 },
                { t: 'breed', p: 33, minHealth: 5 },
                { t: 'move', p: 50, cellVegAmountToMove: 6 }
            ]
        },
        {
            name: "blue",
            size: "s",
            actions: [
                { t: 'eat', p: 100 },
                { t: 'breed', p: 50, minHealth: 16 },
                { t: 'move', p: 20, cellVegAmountToMove: 3 },
            ]
        },
        {
            name: "orange",
            size: "s",
            actions: [
                { t: 'eat', p: 100 },
                { t: 'move', p: 100, cellVegAmountToMove: 4 },
                { t: 'breed', p: 100, minHealth: 16 },
            ]
        },
        {
            name: "purple",
            size: "s",
            actions: [
                { t: 'eat', p: 100 },
                { t: 'breed', p: 50, minHealth: 16 },
                { t: 'move', p: 30, cellVegAmountToMove: 4 },
            ]
        }
    ],
}

module.exports = worldParams