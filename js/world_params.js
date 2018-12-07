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
        amount: 100
    },
    penalties: {
        breathing: 2,
        moving: 3
    },
    rendering: {
        creatures: [
            [255,0,0],
            [0,0,255]
        ]
    },

    creatures: [
        {
            name: "creature 1",
            actions: [
                {
                    t: 'eatVegetation',
                    p: 100,
                    amount: 4
                },
                {
                    t: 'move',
                    p: 100,
                    cellVegAmountToMove: 6
                }
            ]
        },
        {
            name: "creature 2",
            actions: [
                {
                    t: 'eatVegetation',
                    p: 100,
                    amount: 4
                },
                {
                    t: 'move',
                    p: 50,
                    cellVegAmountToMove: 6
                }
            ]
        },
    ],

}