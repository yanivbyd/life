function Creature(health, type, creatureLogic)
{
    this.health = health;
    this.logic = creatureLogic;
    this.type = type;
    this.size = creatureLogic.params.size;
}

Creature.prototype.getDNA = function()
{
    return this.logic.params._dna;
}

Creature.prototype.fixMaxHealth = function()
{
    this.health = Math.min(this.health, creatureSize.maxHealth(this.size));
}

Creature.prototype.cycle = function(ctx)
{
    if (this.playedCycle == ctx.world.currentCycle) return;  // So the same create won't play twice on the same cycle
    if (utils.checkPercentage(worldParams.rules.randomDeathChance)) {
        assert.strictEqual(ctx.cell.creature, this);
        ctx.cell.creature = null;
        ctx.world.incCycleStats('deaths', this.type);
        return;
    }

    this.logic.cycle(this, ctx);
    this.health -= creatureSize.penaltyBreathing(this.size);
    this.playedCycle = ctx.world.currentCycle;

    this.health = Math.floor(this.health);
    if (this.health <= 0) {
        assert.strictEqual(ctx.cell.creature, this);
        ctx.cell.creature = null;
        ctx.world.incCycleStats('deaths', this.type);
    }
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
    const maxHealth = creatureSize.maxHealth(this.creature.size);
    const leftForCreature = maxHealth - this.creature.health;
    const actualAmount = Math.min(vegAmount, this.cell.vegetation, leftForCreature);
    this.creature.health += actualAmount;
    assert(this.creature.health <= maxHealth);
    this.creature.fixMaxHealth(); // no need for it because of the assert
    this.cell.vegetation = Math.floor(this.cell.vegetation - actualAmount);
    assert(this.cell.vegetation>=0);
}

CycleContext.prototype.getCurrentVegetation = function()
{
    return this.cell.vegetation;
}

CycleContext.prototype.findEmptyCellWithMostVeg = function()
{
    var maxCells = [];
    const cells = this.world.nearCells(this.row, this.col);

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

CycleContext.prototype.findAttackOpponent = function(opponentMaxHealth)
{
    var options = [];
    const cells = this.world.nearCells(this.row, this.col);

    for (var i=0;i<cells.length;i++) {
        const opponent = cells[i].creature;
        if (opponent && opponent.type != this.creature.type && opponent.health <= opponentMaxHealth) {
            options.push(cells[i]);
        }
    }
    return utils.randomArrayItem(options);
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
        var mate = cells[i].creature;
        if (mate && mate.type == this.creature.type) {
            if (mate.health / 2 - worldParams.rules.penalties.breed >= 1
                && mate.health >= mate.logic.breedParams.minHealth)
            {
                return cells[i];
            }
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
    babyHealth = Math.floor(babyHealth);
    if (babyHealth <= 0) return;

    var babyLogicParams = dna.creatureParamsForBaby(this.creature.logic.params,
        mateCell.creature.logic.params, worldParams.rules.mutationChance, worldParams.rules.switchGeneChance);
    emptyCell.creature = new Creature(babyHealth, this.creature.type,
        new CreatureLogic(babyLogicParams));    // TODO: Add cache for creature logic

    this.creature.health -= (babyHealth1 + worldParams.rules.penalties.breed);
    mateCell.creature.health -= (babyHealth2 + worldParams.rules.penalties.breed);
    mateCell.creature.health = Math.floor(mateCell.creature.health);

    assert(this.creature.health >= 1, "health below 0 (or will be rounded to 0) " + this.creature.health);
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
            utils.checkPercentage(this.params.p) && creature.health > worldParams.rules.penalties.moving)
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
    if (creature.health / 2 - worldParams.rules.penalties.breed < 1) return; // so as not to die
    const mateCell = ctx.findBreedMate();
    if (mateCell) {
        var emptyCell = ctx.findEmptyCellWithMostVeg();
        if (emptyCell && utils.checkPercentage(this.params.p)) {
            ctx.breed(mateCell, emptyCell);
            ctx.world.incCycleStats('births', creature.type);
        }
    }
}

action.Attack = function(logicParams)
{
    this.params = logicParams;
}

action.Attack.prototype.cycle = function(creature, ctx)
{
    if (creature.health < this.params.minHealth) return;
    if (creature.health <= worldParams.rules.penalties.attackIntent + worldParams.rules.penalties.attack) return;
    if (!utils.checkPercentage(this.params.p)) return;
    const cell = ctx.findAttackOpponent(this.params.opponentMaxHealth);
    if (cell) {
        const opponent = cell.creature;
        if (utils.checkPercentage(worldParams.rules.attackSuccess)) {
            opponent.health -= creature.size;
            if (opponent.health < 0) {
                cell.creature = creature;  // move to the dead creature place
                ctx.cell.creature = null;
                ctx.row = cell.row;
                ctx.col = cell.col;
                ctx.cell = cell;

                ctx.world.incCycleStats('kills', creature.type);
                ctx.world.incCycleStats('deaths', opponent.type);
            }
            creature.health -= worldParams.rules.penalties.attack;
        }
    }
    creature.health -= worldParams.rules.penalties.attackIntent;
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
        else if (logicAction.t == 'attack') {
            this.actions.push(new action.Attack(logicAction));
            this.attackParams = logicAction;
        }
    }
}

CreatureLogic.prototype.cycle = function(creature, ctx)
{
    for (var i=0;i<this.actions.length;i++) {
        if (creature.health > 0) {
            this.actions[i].cycle(creature, ctx);
        }
    }
}

creature = {
    Creature: Creature,
    CycleContext: CycleContext,
    CreatureLogic: CreatureLogic
};
module.exports = creature;