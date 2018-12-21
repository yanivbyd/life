function Creature(health, type, creatureLogic)
{
    this.health = health;
    this.logic = creatureLogic;
    this.type = type;
    this.size = creatureLogic.params.size;
}

Creature.prototype.fixMaxHealth = function()
{
    this.health = Math.min(this.health, creatureSize.maxHealth(this.size));
}

Creature.prototype.cycle = function(ctx)
{
    if (this.playedCycle == ctx.world.currentCycle) return;
    this.logic.cycle(this, ctx);
    this.health -= creatureSize.penaltyBreathing(this.size);
    this.playedCycle = ctx.world.currentCycle;
    if (this.health <= 0) {
        assert.strictEqual(ctx.cell.creature, this);
        ctx.cell.creature = null;
    }
}

Creature.prototype.init = function(cell, health, type, creatureLogic)
{
    cell.creature = new Creature(type, creatureLogic);
}


function CycleContext(world)
{
    this.world = world;
}

CycleContext.prototype.nextCell = function(row, col)
{
    this.row = row;
    this.col = col;
    this.cell = this.world.matrix[row][col];
    this.creature = this.cell.creature;
}

CycleContext.prototype.eat = function(vegAmount)
{
    var maxHealth = creatureSize.maxHealth(this.creature.size);
    var leftForCreature = maxHealth - this.creature.health;
    var actualAmount = Math.min(vegAmount, this.cell.vegetation, leftForCreature);
    this.creature.health += actualAmount;
    assert(this.creature.health <= maxHealth);
    this.creature.fixMaxHealth(); // no need for it because of the assert
    this.cell.vegetation -= actualAmount;
    assert(this.cell.vegetation>=0);
}

CycleContext.prototype.getCurrentVegetation = function()
{
    return this.cell.vegetation;
}

CycleContext.prototype.findEmptyCellWithMostVeg = function()
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
    return utils.randomArrayItem(maxCells);
}

CycleContext.prototype.move = function(toCell)
{
    assert(!toCell.creature);
    toCell.creature = this.cell.creature;
    this.cell.creature = null;
    var newPos = this.world.findPosFromNearby(this.row, this.col, toCell);
    this.row = newPos.row;
    this.col = newPos.col;
    this.cell = toCell;
    this.creature.health -= worldParams.rules.penalties.moving;
}

CycleContext.prototype.findBreedMate = function()
{
    var cells = this.world.nearCells(this.row, this.col);
    for (var i=0;i<cells.length;i++) {
        if (cells[i].creature && cells[i].creature.type == this.creature.type) {
            var mateMinHealth = Math.max(worldParams.rules.penalties.breed * 2, // * 2 because of health given to baby
                    cells[i].creature.logic.breedParams.minHealth);
            if (cells[i].creature.health > mateMinHealth)
                return cells[i];
        }
    }
    return null;
}

CycleContext.prototype.breed = function(mateCell, emptyCell)
{
    assert.equal(this.creature.type, mateCell.creature.type);
    // TODO: Assert mateCell and emptyCell are near this.cell
    var babyHealth1 = this.creature.health / 2;
    var babyHealth2 = mateCell.creature.health / 2;
    var babyHealth = babyHealth1 + babyHealth2 - worldParams.rules.penalties.babyPenalty;
    if (babyHealth <= 0) return;

    var babyLogicParams = dna.creatureParamsForBaby(this.creature.logic.params,
        mateCell.creature.logic.params, worldParams.rules.mutationChance);
    emptyCell.creature = new Creature(babyHealth, this.creature.type,
        new CreatureLogic(babyLogicParams));    // TODO: Add cache for creature logic

    this.creature.health -= (babyHealth1 + worldParams.rules.penalties.breed);
    mateCell.creature.health -= (babyHealth2 + worldParams.rules.penalties.breed);

    assert(this.creature.health > 0, "health below 0");
    assert(mateCell.creature.health > 0, "mate health below 0");
}

// Action types
action = {};

action.Eat = function(logicParams, size)
{
    this.params = logicParams;
    this.amount = creatureSize.eating(size);
}
action.Eat.prototype.cycle = function(creature, ctx)
{
    if (utils.checkPercentage(this.params.p))
        ctx.eat(this.amount);
}

action.Move = function(logicParams)
{
    this.params = logicParams;
}
action.Move.prototype.cycle = function(creature, ctx)
{
    if (ctx.getCurrentVegetation() <= this.params.cellVegAmountToMove) {
        var nextCell = ctx.findEmptyCellWithMostVeg();
        if (nextCell && nextCell.vegetation > ctx.getCurrentVegetation() &&
            utils.checkPercentage(this.params.p))
        {
            ctx.move(nextCell);
        }
    }
}

action.Breed = function(logicParams)
{
    this.params = logicParams;
}
action.Breed.prototype.cycle = function(creature, ctx)
{
    if (creature.health < this.params.minHealth) return;
    if (creature.health <= 2 * worldParams.rules.penalties.breed) return; // so as not to die
    var mateCell = ctx.findBreedMate();
    if (mateCell) {
        var emptyCell = ctx.findEmptyCellWithMostVeg();
        if (emptyCell && utils.checkPercentage(this.params.p)) {
            ctx.breed(mateCell, emptyCell);
        }
    }
}

CreatureLogic = function (logicParams)
{
    this.params = logicParams;
    this.actions = [];
    for (var i=0;i<logicParams.actions.length;i++) {
        var logicAction = logicParams.actions[i];
        if (logicAction.t == 'eat') {
            this.actions.push(new action.Eat(logicAction, this.params.size));
            this.eatParams = logicAction;
        }
        else if (logicAction.t == 'move') {
            this.actions.push(new action.Move(logicAction));
            this.moveParams = logicAction;
        }
        else if (logicAction.t == 'breed') {
            this.actions.push(new action.Breed(logicAction));
            this.breedParams = logicAction;
        }
    }
}

CreatureLogic.prototype.cycle = function(creature, ctx)
{
    for (var i=0;i<this.actions.length;i++) {
        this.actions[i].cycle(creature, ctx);
    }
}


creature = {
    Creature: Creature,
    CycleContext: CycleContext,
    CreatureLogic: CreatureLogic
};
module.exports = creature;