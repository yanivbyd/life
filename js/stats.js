function Sampler(name, idToText, idToNum)
{
    this.name = name;
    this.vals = {};
    this.count = 0;
    this.sum = 0;
    if (idToText !== undefined) this.idToText = idToText;
    if (idToNum !== undefined) this.idToNum = idToNum;
}
Sampler.prototype.getFreq = function(val)
{
    return this.vals[val] | 0;
}
Sampler.prototype.avg = function(val)
{
    return (this.sum && this.count) ? this.sum / this.count : 0;
}
Sampler.prototype.sample = function(val)
{
    this.count++;
    var num = (this.idToNum === undefined) ? val : this.idToNum[val];
    if (!isNaN(num)) this.sum += num;

    if (!this.vals[val]) this.vals[val] = 1;
    else this.vals[val]++;
}
Sampler.prototype.valsByFreq = function()
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
Sampler.prototype.display = function(val)
{
    if (this.idToText) return this.idToText[val] || val;
    return val;
}
Sampler.prototype.toString = function(numResults)
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

function addSamplerText(arr, sampler, avgFixedSize)
{
    if (!sampler.count) return;
    arr.push(sampler.name + ": "
        + sampler.avg().toFixed(avgFixedSize | 0) + " (avg) "
        + "[" + sampler.toString() + "]");
}

stats = {
    calcStats: function(world) {
        var statsObj = { cycle: world.currentCycle | 0 };

        statsObj.vegetation = new Sampler("vegetation");
        statsObj.size = new Sampler("size", {}, { "s" : 1, "m": 2, "l": 3 });
        statsObj.movePerc = new Sampler("move percent");
        statsObj.moveMaxVeg = new Sampler("move max veg");
        statsObj.eatPerc = new Sampler("eat percent");
        statsObj.breedPerc = new Sampler("breed percent");
        statsObj.breedminHealth = new Sampler("breed min health");
        statsObj.creatures = new Sampler("creature", creatureIdToText());

        for (var row=0;row<world.size;row++) {
            for (var col=0;col<world.size;col++) {
                var cell = world.matrix[row][col];
                statsObj.vegetation.sample(cell.vegetation);
                if (cell.creature) {
                    statsObj.creatures.sample(cell.creature.type);
                    statsObj.size.sample(cell.creature.size);
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
        if (statsObj.creatures.count) {
            arr.push("creatures: " + utils.numberWithCommas(statsObj.creatures.count));
            arr.push(statsObj.creatures.name + ": " + statsObj.creatures.toString(5));
        }
        arr.push(statsObj.vegetation.name + ": " + statsObj.vegetation.avg().toFixed(1));
        if (statsObj.creatures.count)
            arr.push("genes");
        addSamplerText(arr, statsObj.size, 1);
        addSamplerText(arr, statsObj.movePerc);
        addSamplerText(arr, statsObj.moveMaxVeg);
        addSamplerText(arr, statsObj.eatPerc);
        addSamplerText(arr, statsObj.breedPerc);
        addSamplerText(arr, statsObj.breedminHealth);
        return arr.join('\n');
    }
}
module.exports = stats