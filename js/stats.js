function SamplingEnum(idToText)
{
    this.vals = {};
    this.count = 0;
    this.sum = 0;
    if (idToText !== undefined) this.idToText = idToText;
}
SamplingEnum.prototype.getFreq = function(val)
{
    return this.vals[val] | 0;
}
SamplingEnum.prototype.avg = function(val)
{
    return (this.sum && this.count) ? this.sum / this.count : 0;
}
SamplingEnum.prototype.sample = function(val)
{
    this.count++;
    if (!isNaN(val)) this.sum += val;

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
SamplingEnum.prototype.display = function(val)
{
    if (this.idToText) return this.idToText[val] || val;
    return val;
}
SamplingEnum.prototype.toString = function(numResults)
{
    numResults = numResults | 3;
    var sampler = this;
    return this.valsByFreq().map(x => sampler.display(x.val) + ' ('
        + percentage(x.freq, sampler.count) + '%)')
        .slice(0, numResults).join(', ');
}

function creatureIdToText()
{
    var idToText = {};
    for (var i=0;i<worldParams.creatures.length;i++) {
        idToText[i] = worldParams.creatures[i].name;
    }
    return idToText;
}

stats = {
    calcStats: function(world) {
        var statsObj = { cycle: world.currentCycle | 0 };

        statsObj.vegetation = new SamplingEnum();
        statsObj.sizes = new SamplingEnum();
        statsObj.movePerc = new SamplingEnum();
        statsObj.moveMaxVeg = new SamplingEnum();
        statsObj.eatPerc = new SamplingEnum();
        statsObj.breedPerc = new SamplingEnum();
        statsObj.breedminHealth = new SamplingEnum();
        statsObj.creatures = new SamplingEnum(creatureIdToText());

        for (var row=0;row<world.size;row++) {
            for (var col=0;col<world.size;col++) {
                var cell = world.matrix[row][col];
                statsObj.vegetation.sample(cell.vegetation);
                if (cell.creature) {
                    statsObj.creatures.sample(cell.creature.type);
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
        arr.push("total creatures: " + utils.numberWithCommas(statsObj.creatures.count));
        arr.push("creature: " + statsObj.creatures.toString(5));
        arr.push("vegetation: " + statsObj.vegetation.avg().toFixed(1));
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