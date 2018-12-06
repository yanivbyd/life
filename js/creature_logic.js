
function CreateLogicDefault(logicParams)
{
    this.params = logicParams;
}

CreateLogicDefault.prototype.cycle = function(creature, ctx)
{
    ctx.eatVegetation(this.params.eatVeg.amount);

    if (ctx.getCurrentVegetation() <= this.params.move.cellVegAmountToMove) {
        var nextCell = ctx.findEmptyCellWithMostVeg();
        if (nextCell && nextCell.vegetation > ctx.getCurrentVegetation()) {
            ctx.move(nextCell);
        }
    }
}