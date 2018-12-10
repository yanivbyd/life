function SamplingGroup(histMax)
{
    this.histMax = histMax;
    this.sum = 0;
    this.count = 0;
}

SamplingGroup.prototype.sample = function(val)
{
    this.count++;
    this.sum += val;
}

SamplingGroup.prototype.toString = function()
{
    var out = [];
    out.push("count=" + utils.shortNumber(this.count));
    if (this.sum) {
        out.push("avg="+this.avg());
    }
    return out.join(", ");
}

SamplingGroup.prototype.avg = function()
{
    return (this.sum) ? (this.sum / this.count).toFixed(2) : '';
}

function renderSummary(world)
{
    var vegetation = new SamplingGroup(worldParams.veg.maxAmount);
    var creatures = [];
    for (var i=0;i<worldParams.creatures.length;i++) {
        creatures.push(new SamplingGroup(worldParams.creature["l"].maxHealth));
    }

    for (var row=0;row<world.size;row++)
        for (var col=0;col<world.size;col++) {
            var cell = world.matrix[row][col];
            vegetation.sample(cell.vegetation);
            if (cell.creature) creatures[cell.creature.type].sample(cell.creature.health);
        }

    var text = "";
    for (var i=0;i<worldParams.creatures.length;i++) {
        text += worldParams.creatures[i].name + ": "+ utils.numberWithCommas(creatures[i].count)
                + ', health: '+ creatures[i].avg() +"\n";
    }
    text += "vegetation: " + vegetation.avg() + "\n";
    text += "cycle: " + utils.numberWithCommas(world.cycles);
    return text;
}

module.exports = renderSummary