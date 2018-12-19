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

function SamplingEnum()
{
    this.vals = {};
    this.count = 0;
}
SamplingEnum.prototype.sample = function(val)
{
    this.count++;
    if (!this.vals[val]) this.vals[val] = 1;
    else this.vals[val]++;
}
SamplingEnum.prototype.valsByFreq = function()
{
    var vals = [];
    for (val in this.vals) {
        vals.push({val: val, freq: this.vals[val]})
    }
    vals.sort(function(a,b) { return b.freq-a.freq });
    return vals;
}
SamplingEnum.prototype.toString = function()
{
    return this.valsByFreq().map(x => x.val + ': ' + x.freq).join(', ');
}

stats = {
    calcStats: function(world) {
        var statsObj = { cycle: world.currentCycle | 0 };

        statsObj.vegetation = new SamplingGroup(worldParams.veg.maxAmount);
        statsObj.sizes = new SamplingEnum();
        statsObj.creatures = [];
        for (var i=0;i<worldParams.creatures.length;i++) {
            statsObj.creatures.push(new SamplingGroup(worldParams.creature["l"].maxHealth));
        }

        for (var row=0;row<world.size;row++) {
            for (var col=0;col<world.size;col++) {
                var cell = world.matrix[row][col];
                statsObj.vegetation.sample(cell.vegetation);
                if (cell.creature) {
                    statsObj.creatures[cell.creature.type].sample(cell.creature.health);
                    statsObj.sizes.sample(cell.creature.size);
                }
            }
        }

        return statsObj;
    },
    statsToText: function(statsObj) {
        var text = "";
        for (var i=0;i<worldParams.creatures.length;i++) {
            text += worldParams.creatures[i].name + ": "+ utils.numberWithCommas(statsObj.creatures[i].count)
                    + ', health: '+ statsObj.creatures[i].avg() +"\n";
        }
        text += "vegetation: " + statsObj.vegetation.avg() + "\n";
        text += "sizes: " + statsObj.sizes.toString() + "\n";
        text += "cycle: " + utils.numberWithCommas(statsObj.cycle);
        return text;
    }
}
module.exports = stats