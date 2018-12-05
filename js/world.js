function World()
{

}

World.prototype.init = function(size)
{
    window.lifeCbs = {
        creatureDied: function() {
            console.log("creature died");
        }
    }
    this.size = size;
    this.cycles = 0;
    this.matrix = [];
    for(var i=0; i<size; i++) {
        this.matrix[i] = [];
        for(var j=0; j<size; j++) {
            this.matrix[i][j] = new Cell(randomInt(global_world_params.veg.maxAmount+1));
        }
    }
}

World.prototype.addCreatures = function()
{
    var creatureAmount = global_world_params.addCreatures.amount;
    var maxTries = creatureAmount * 10, try_count = 0;
    var creatureLogic = new CreateLogicDefault({
        eatVeg: {
            amount: global_world_params.defaultCreature.eatVegAmount
        }
    });

    while (creatureAmount>0 && try_count < maxTries) {
        var cell = this.matrix[randomInt(this.size)][randomInt(this.size)];
        if (!cell.creature) {
            cell.creature = new Creature(global_world_params.addCreatures.initialHealth, creatureLogic);
            creatureAmount--;
        }
        try_count++;
    }
}

World.prototype.cycle = function()
{
    var cycleCtx = new CreateCycleContext(this);
    for(var i=0; i<this.size; i++) {
        for(var j=0; j<this.size; j++) {
            cycleCtx.nextCell(i,j);
            var cell = this.matrix[i][j];
            cycleVegetation(cell);
            cycleCreature(cell, cycleCtx);
        }
    }
    this.cycles++;
}

function Cell(vegetation)
{
    this.vegetation = vegetation;
}

