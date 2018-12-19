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
function percentage(count, total)
{
    return Math.floor(count * 100 / total);
}
SamplingEnum.prototype.toString = function(numResults)
{
    numResults = numResults | 3;
    var count = this.count;
    return this.valsByFreq().map(x => x.val + ' (' + percentage(x.freq, count) + '%)')
        .slice(0, numResults).join(', ');
}

stats = {
    calcStats: function(world) {
        var statsObj = { cycle: world.currentCycle | 0 };

        statsObj.vegetation = new SamplingGroup(worldParams.veg.maxAmount);
        statsObj.sizes = new SamplingEnum();
        statsObj.movePerc = new SamplingEnum();
        statsObj.moveMaxVeg = new SamplingEnum();
        statsObj.eatPerc = new SamplingEnum();
        statsObj.breedPerc = new SamplingEnum();
        statsObj.breedminHealth = new SamplingEnum();
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
                    statsObj.movePerc.sample(cell.creature.logic.moveParams.p);
                    statsObj.moveMaxVeg.sample(cell.creature.logic.moveParams.cellVegAmountToMove);
                    statsObj.eatPerc.sample(cell.creature.logic.eatParams.p);
                    statsObj.breedPerc.sample(cell.creature.logic.breedParams.p);
                    statsObj.breedminHealth.sample(cell.creature.logic.breedParams.minHealth);
                }
            }
        }

        return statsObj;
    },
    statsToText: function(statsObj) {
        var arr = [];
        arr.push("cycle: " + utils.numberWithCommas(statsObj.cycle));
        for (var i=0;i<worldParams.creatures.length;i++) {
            arr.push(worldParams.creatures[i].name + ": "+ utils.numberWithCommas(statsObj.creatures[i].count)
                    + ', health: '+ statsObj.creatures[i].avg());
        }
        arr.push("vegetation: " + statsObj.vegetation.avg());
        arr.push("genes:");
        arr.push("size: " + statsObj.sizes.toString());
        arr.push("move percent: " + statsObj.movePerc.toString());
        arr.push("move max veg: " + statsObj.moveMaxVeg.toString());
        arr.push("eat percent: " + statsObj.eatPerc.toString());
        arr.push("breed percent: " + statsObj.breedPerc.toString());
        arr.push("breed min health: " + statsObj.breedminHealth.toString());
        return arr.join('\n');
    }
}
module.exports = stats