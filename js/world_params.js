var global_world_params = {
    veg: {
        maxAmount: 20,
        rain: 1
    },
    creature: {
        initialHealth: 10,
        maxHealth: 20
    },
    addCreatures: {
        amount: 5000
    },
    eatingBySize: {
        "s": 4,
        "m": 6,
        "l": 8,
    },
    penalties: {
        breathingBySize: {
            "s": 2,
            "m": 3,
            "l": 3.5,
        },
        moving: 3,
        breed: 2,
        babyPenalty: 2
    },
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
            ],
            acceptBreed: { p: 100, minHealth: 5 }
        },
        {
            name: "blue",
            size: "s",
            actions: [
                { t: 'eat', p: 100 },
                { t: 'breed', p: 50, minHealth: 16 },
                { t: 'move', p: 50, cellVegAmountToMove: 6 },
            ],
            acceptBreed: { p: 100, minHealth: 15 }
        },
        {
            name: "orange",
            size: "s",
            actions: [
                { t: 'eat', p: 100 },
                { t: 'move', p: 100, cellVegAmountToMove: 4 },
                { t: 'breed', p: 100, minHealth: 16 },
            ],
            acceptBreed: { p: 100, minHealth: 16 }
        },
        {
            name: "purple",
            size: "s",
            actions: [
                { t: 'eat', p: 100 },
                { t: 'breed', p: 50, minHealth: 16 },
                { t: 'move', p: 100, cellVegAmountToMove: 10 },
            ],
            acceptBreed: { p: 100, minHealth: 15 }
        }
    ],

}