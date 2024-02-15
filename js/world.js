function Cell(vegetation)
{
    this.vegetation = vegetation;
}

function World()
{
}

World.prototype.init = function(size)
{
    this.initEmpty(size);
    for(var i=0; i<size; i++) {
        for(var j=0; j<size; j++) {
            this.matrix[i][j] = new Cell(utils.randomInt(worldParams.rules.veg.maxAmount+1));
        }
    }
}

World.prototype.initEmpty = function(size, cycle)
{
    this.currentCycle = cycle || 0;
    this.size = size;
    this.nextCycle = this.currentCycle + 1;
    this.matrix = [];
    for(var i=0; i<size; i++) {
        this.matrix[i] = [];
        for(var j=0; j<size; j++) {
            this.matrix[i][j] = new Cell(0);
        }
    }
}

World.prototype.isValidIndex = function(index) {
    return index >= 0 && index < this.size;
}

World.prototype.nearCells = function(row, col)
{
    var deltas = lifeArrays.getNearbyDeltas();
    var cells = [];
    for (var i=0;i<deltas.length;i++) {
        var row1 = row+deltas[i].dy;
        var col1 = col+deltas[i].dx;
        if (this.isValidIndex(row1) && this.isValidIndex(col1)) {
            cells.push(this.matrix[row1][col1]);
        }
    }
    return cells;
}

World.prototype.findPosFromNearby = function(row, col, cell)
{
    var deltas = lifeArrays.getNearbyDeltas();
    for (var i=0;i<deltas.length;i++) {
        var row1 = row+deltas[i].dy;
        var col1 = col+deltas[i].dx;
        if (this.isValidIndex(row1) && this.isValidIndex(col1)) {
            if (this.matrix[row1][col1] === cell) {
                return { row: row1, col: col1 };
            }
        }
    }
    panic("Cell not nearby " + row + "," + col);
}

World.prototype.addCreatures = function(singleType)
{
    for (var i=0;i<worldParams.creatures.length;i++) {
        if (singleType && worldParams.creatures[i].name != singleType) continue;
        this.addCreaturesOfType(i);
    }
}

World.prototype.addCreaturesOfType = function(type)
{
    var creatureAmount = worldParams.rules.addCreatures.amount;
    var maxTries = creatureAmount * 10, try_count = 0;
    dna.initDNAForCreatureParams(worldParams.creatures[type]);
    var creatureLogic = new creature.CreatureLogic(worldParams.creatures[type]);
    var size = creatureLogic.params.size;

    while (creatureAmount>0 && try_count < maxTries) {
        var cell = this.matrix[utils.randomInt(this.size)][utils.randomInt(this.size)];
        if (!cell.creature) {
            var health = creatureSize.initialHealth(size);
            cell.creature = new creature.Creature(health, type, creatureLogic);
            creatureAmount--;
        }
        try_count++;
    }
}

World.prototype.findCreature = function()
{
    for(var i=0; i<this.size; i++) {
        for(var j=0; j<this.size; j++) {
            if (this.matrix[i][j].creature)
                return this.matrix[i][j].creature;
        }
    }
}

function cycleVegetation(cell)
{
    cell.vegetation += worldParams.rules.veg.rain;
    cell.vegetation = Math.min(cell.vegetation, worldParams.rules.veg.maxAmount);
}

World.prototype.cycle = function()
{
    this.currentCycle = this.nextCycle;
    this.nextCycle++;
    var cycleCtx = new creature.CycleContext(this);
    for(var i=0; i<this.size; i++) {
        for(var j=0; j<this.size; j++) {
            cycleCtx.nextCell(i,j);
            var cell = this.matrix[i][j];
            cycleVegetation(cell);
            if (cell.creature) cell.creature.cycle(cycleCtx);
        }
    }
}

module.exports = {
    World: function() { return new World(); },
    Cell: function() { return new Cell(); }
}