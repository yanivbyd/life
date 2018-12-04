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
    var breathingPenalty = 2;
    creature.health -= breathingPenalty;
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