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
    creatures: [
        {
            eatVeg: {
                amount: 4,
            },
            move: {
                cellVegAmountToMove: 6
            }
        },
        {
            eatVeg: {
                amount: 4,
            },
            move: {
                cellVegAmountToMove: 4
            }
        },
    ],
    penalties: {
        breathing: 2,
        moving: 3
    },
    rendering: {
        creatures: [
            [255,0,0],
            [0,0,255]
        ]
    }
}