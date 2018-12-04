
function CreateLogicDefault(logicParams)
{
    this.params = logicParams;
}

CreateLogicDefault.prototype.cycle = function(creature, ctx)
{
    ctx.eatVegetation(this.params.eatVeg.amount);
}