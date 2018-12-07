function Creature(health, type, creatureLogic)
{
    this.health = health;
    this.logic = creatureLogic;
    this.type = type;
}

Creature.prototype.fixMaxHealth = function()
{
    this.health = Math.min(this.health, global_world_params.creature.maxHealth);
}

function cycleCreature(cell, ctx)
{
    if (!cell.creature || cell.creature.lastCycle == ctx.world.cycles) return;
    var creature = cell.creature;
    creature.logic.cycle(creature, ctx);
    creature.health -= global_world_params.penalties.breathing;
    creature.lastCycle = ctx.world.cycles;
    if (creature.health <= 0) {
        if (lifeCbs) lifeCbs.creatureDied();
        assertSamePointer(ctx.cell.creature, creature);
        ctx.cell.creature = null;
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
    this.creature.fixMaxHealth();
    cell.vegetation -= actualAmount;
}

CreateCycleContext.prototype.getCurrentVegetation = function()
{
    return this.cell.vegetation;
}

CreateCycleContext.prototype.findEmptyCellWithMostVeg = function()
{
    var maxCells = [];
    var cells = this.world.nearCells(this.row, this.col);

    for (var i=0;i<cells.length;i++) {
        if (cells[i].vegetation == 0 || cells[i].creature) continue;
        if (maxCells.length == 0) {
            maxCells.push(cells[i]);
            continue;
        }
        if (cells[i].vegetation == maxCells[0].vegetation) {
            maxCells.push(cells[i]);
        } else if (cells[i].vegetation > maxCells[0].vegetation) {
            maxCells.length = 0; // Emptying the array
            maxCells.push(cells[i]);
        }
    }
    return randomArrayItem(maxCells);
}

CreateCycleContext.prototype.move = function(toCell)
{
    assert(!toCell.creature);
    toCell.creature = this.cell.creature;
    this.cell.creature = null;
    var newPos = this.world.findPosFromNearby(this.row, this.col, toCell);
    this.row = newPos.row;
    this.col = newPos.col;
    this.cell = toCell;
    this.creature.health -= global_world_params.penalties.moving;
}