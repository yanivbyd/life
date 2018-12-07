
function CreateLogicDefault(logicParams)
{
    this.params = logicParams;
    this.actions = [];
    for (var i=0;i<logicParams.actions.length;i++) {
        var logicAction = logicParams.actions[i];
        if (logicAction.t == 'eatVegetation')
            this.actions.push(new ActionEatVegetation(logicAction));
        else if (logicAction.t == 'move')
            this.actions.push(new ActionMove(logicAction));
        else if (logicAction.t == 'breed')
            this.actions.push(new ActionBreed(logicAction));
    }
}

CreateLogicDefault.prototype.cycle = function(creature, ctx)
{
    for (var i=0;i<this.actions.length;i++) {
        if (checkPercentage(this.actions[i].params.p))  // TODO: Ugly, don't force the actions to have 'params' member
            this.actions[i].cycle(creature, ctx);
    }
}

// Action types

function ActionEatVegetation(logicParams)
{
    this.params = logicParams;
}
ActionEatVegetation.prototype.cycle = function(creature, ctx)
{
    ctx.eatVegetation(this.params.amount);
}

function ActionMove(logicParams)
{
    this.params = logicParams;
}
ActionMove.prototype.cycle = function(creature, ctx)
{
    if (ctx.getCurrentVegetation() <= this.params.cellVegAmountToMove) {
        var nextCell = ctx.findEmptyCellWithMostVeg();
        if (nextCell && nextCell.vegetation > ctx.getCurrentVegetation()) {
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
        if (emptyCell) {
            ctx.breed(mateCell, emptyCell);
        }
    }
}

