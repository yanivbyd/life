function Cell(vegetation)
{
    this.vegetation = vegetation;
}

function randomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function initGame(world, size)
{
    window.lifeCbs = {
        creatureDied: function() {
            console.log("creature died");
        }
    }
    world.size = size;
    world.cycles = 0;
    world.matrix = [];
    for(var i=0; i<size; i++) {
        world.matrix[i] = [];
        for(var j=0; j<size; j++) {
            world.matrix[i][j] = new Cell(randomInt(global_world_params.veg.maxAmount+1));
        }
    }
}

function addCreaturesToWorld(world)
{
    var creatureAmount = global_world_params.addCreatures.amount;
    var maxTries = creatureAmount * 10, try_count = 0;
    var creatureLogic = new CreateLogicDefault({
        eatVeg: {
            amount: global_world_params.defaultCreature.eatVegAmount
        }
    });

    while (creatureAmount>0 && try_count < maxTries) {
        var cell = world.matrix[randomInt(world.size)][randomInt(world.size)];
        if (!cell.creature) {
            cell.creature = new Creature(global_world_params.addCreatures.initialHealth, creatureLogic);
            creatureAmount--;
        }
        try_count++;
    }
}

function cycleWorld(world)
{
    var cycleCtx = new CreateCycleContext(world);
    for(var i=0; i<world.size; i++) {
        for(var j=0; j<world.size; j++) {
            cycleCtx.nextCell(i,j);
            var cell = world.matrix[i][j];
            cycleVegetation(cell);
            cycleCreature(cell, cycleCtx);
        }
    }
    world.cycles++;
}