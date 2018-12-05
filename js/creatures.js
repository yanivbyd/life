function Creature(health, creatureLogic)
{
    this.health = health;
    this.logic = creatureLogic;
}

function cycleCreature(cell, ctx)
{
    if (!cell.creature) return;
    var creature = cell.creature;
    creature.logic.cycle(creature, ctx);
    creature.health -= global_world_params.penalties.breathing;
    if (creature.health <= 0) {
        if (lifeCbs) lifeCbs.creatureDied();
        cell.creature = null;
    }
}

function initCreature(cell, health, type, creatureLogic)
{
    cell.creature = new Creature(type, creatureLogic);
}


function CreateCycleContext(world)
{
    this.world = world;
}

CreateCycleContext.prototype.nextCell = function(row, col)
{
    this.row = row;
    this.col = col;
    this.cell = this.world.matrix[row][col];
    this.creature = this.cell.creature;
}

CreateCycleContext.prototype.eatVegetation = function(vegAmount)
{
    var cell = this.cell;
    var actualAmount = Math.min(vegAmount, cell.vegetation);
    this.creature.health += actualAmount;
    cell.vegetation -= actualAmount;
}

CreateCycleContext.prototype.getCurrentVegetation = function()
{
    return this.cell.vegetation;
}

CreateCycleContext.prototype.findEmptyCellWithMostVeg = function()
{
    var maxCell = null;
    var cells = this.world.nearCells(this.row, this.col);

    for (var i=0;i<cells.length;i++) {
        if (!maxCell) {
            maxCell = cells[i];
            continue;
        }
        if (!cells[i].creature && cells[i].vegetation >= maxCell.vegetation) {
            if (cells[i].vegetation == maxCell.vegetation && randomPercentage(50)) continue;
            maxCell = cells[i];
        }
    }
    return maxCell;
}

CreateCycleContext.prototype.move = function(toCell)
{
    if (toCell.creature) { console.error("Cant move to a non empty cell"); return; }
    toCell.creature = this.cell.creature;
    this.cell.creature = null;
}