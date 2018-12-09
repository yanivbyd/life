function World()
{

}

World.prototype.init = function(size)
{
    window.lifeCbs = {
        creatureDied: function(creature) {
            console.log("creature died (" + (creature.type+1)+ ")");
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

World.prototype.nearCells = function(row, col)
{
    var deltas = get_nearby_deltas();
    var cells = [];
    for (var i=0;i<deltas.length;i++) {
        var row1 = (row+deltas[i].dy+this.size) % this.size;
        var col1 = (col+deltas[i].dx+this.size) % this.size;
        cells.push(this.matrix[row1][col1]);
    }
    return cells;
}

World.prototype.findPosFromNearby = function(row, col, cell)
{
    var deltas = get_nearby_deltas();
    for (var i=0;i<deltas.length;i++) {
        var row1 = (row+deltas[i].dy+this.size) % this.size;
        var col1 = (col+deltas[i].dx+this.size) % this.size;
        if (this.matrix[row1][col1] === cell) return { row: row1, col: col1 };
    }
    panic("Cell not nearby " + row + "," + col);
}

World.prototype.addCreatures = function()
{
    for (var i=0;i<global_world_params.creatures.length;i++)
        this.addCreaturesOfType(i);
}

World.prototype.addCreaturesOfType = function(type)
{
    var creatureAmount = global_world_params.addCreatures.amount;
    var maxTries = creatureAmount * 10, try_count = 0;
    var creatureLogic = new CreateLogicDefault(global_world_params.creatures[type]);
    var size = creatureLogic.params.size;

    while (creatureAmount>0 && try_count < maxTries) {
        var cell = this.matrix[randomInt(this.size)][randomInt(this.size)];
        if (!cell.creature) {
            cell.creature = new Creature(global_world_params.creature[size].initialHealth, type, creatureLogic);
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

