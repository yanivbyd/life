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
    penalties: {
        breathing: 2,
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
            actions: [
                {
                    t: 'eatVegetation',
                    p: 100,
                    amount: 10
                },
                {
                    t: 'breed',
                    p: 33,
                    minHealth: 5
                },
                {
                    t: 'move',
                    p: 50,
                    cellVegAmountToMove: 6
                }
            ],
            acceptBreed: {
                p: 100,
                minHealth: 5
            }
        },
        {
            name: "blue",
            actions: [
                {
                    t: 'eatVegetation',
                    p: 100,
                    amount: 4
                },
                {
                    t: 'breed',
                    p: 50,
                    minHealth: 16
                },
                {
                    t: 'move',
                    p: 50,
                    cellVegAmountToMove: 6
                },
            ],
            acceptBreed: {
                p: 100,
                minHealth: 15
            }
        },
        {
            name: "orange",
            actions: [
                {
                    t: 'eatVegetation',
                    p: 100,
                    amount: 5
                },
                {
                    t: 'move',
                    p: 100,
                    cellVegAmountToMove: 4
                },
                {
                    t: 'breed',
                    p: 100,
                    minHealth: 16
                },
            ],
            acceptBreed: {
                p: 100,
                minHealth: 16
            }
        },
        {
            name: "purple",
            actions: [
                {
                    t: 'eatVegetation',
                    p: 100,
                    amount: 4
                },
                {
                    t: 'breed',
                    p: 50,
                    minHealth: 16
                },
                {
                    t: 'move',
                    p: 100,
                    cellVegAmountToMove: 10
                },
            ],
            acceptBreed: {
                p: 100,
                minHealth: 15
            }
        }
    ],

}