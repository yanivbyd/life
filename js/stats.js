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

stats = {
    calcStats: function(world) {
        var statsObj = {};

        statsObj.vegetation = new SamplingGroup(worldParams.veg.maxAmount);
        statsObj.creatures = [];
        for (var i=0;i<worldParams.creatures.length;i++) {
            statsObj.creatures.push(new SamplingGroup(worldParams.creature["l"].maxHealth));
        }

        for (var row=0;row<world.size;row++) {
            for (var col=0;col<world.size;col++) {
                var cell = world.matrix[row][col];
                statsObj.vegetation.sample(cell.vegetation);
                if (cell.creature) statsObj.creatures[cell.creature.type].sample(cell.creature.health);
            }
        }

        return statsObj;
    },
    statsToText: function(world, statsObj) {
        var text = "";
        for (var i=0;i<worldParams.creatures.length;i++) {
            text += worldParams.creatures[i].name + ": "+ utils.numberWithCommas(statsObj.creatures[i].count)
                    + ', health: '+ statsObj.creatures[i].avg() +"\n";
        }
        text += "vegetation: " + statsObj.vegetation.avg() + "\n";
        text += "cycle: " + utils.numberWithCommas(world.cycles);
        return text;
    }
}
module.exports = stats