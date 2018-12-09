
function CreateLogicDefault(logicParams)
{
    this.params = logicParams;
    this.actions = [];
    for (var i=0;i<logicParams.actions.length;i++) {
        var logicAction = logicParams.actions[i];
        if (logicAction.t == 'eat')
            this.actions.push(new ActionEat(logicAction, this.params.size));
        else if (logicAction.t == 'move')
            this.actions.push(new ActionMove(logicAction));
        else if (logicAction.t == 'breed')
            this.actions.push(new ActionBreed(logicAction));
    }
}

CreateLogicDefault.prototype.cycle = function(creature, ctx)
{
    for (var i=0;i<this.actions.length;i++) {
        this.actions[i].cycle(creature, ctx);
    }
}

// Action types

function ActionEat(logicParams, size)
{
    this.params = logicParams;
    this.amount = global_world_params.eatingBySize[size];
}
ActionEat.prototype.cycle = function(creature, ctx)
{
    if (checkPercentage(this.params.p))
        ctx.eat(this.amount);
}

function ActionMove(logicParams)
{
    this.params = logicParams;
}
ActionMove.prototype.cycle = function(creature, ctx)
{
    if (ctx.getCurrentVegetation() <= this.params.cellVegAmountToMove) {
        var nextCell = ctx.findEmptyCellWithMostVeg();
        if (nextCell && nextCell.vegetation > ctx.getCurrentVegetation() &&
            checkPercentage(this.params.p))
        {
            ctx.move(nextCell);
        }
    }
}

function ActionBreed(logicParams)
{
    this.params = logicParams;
}
ActionBreed.prototype.cycle = function(creature, ctx)
{
    if (creature.health < this.params.minHealth) return;
    var mateCell = ctx.findBreedMate();
    if (mateCell) {
        var emptyCell = ctx.findEmptyCellWithMostVeg();
        if (emptyCell && checkPercentage(this.params.p)) {
            ctx.breed(mateCell, emptyCell);
        }
    }
}

