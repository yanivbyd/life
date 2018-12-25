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

function Stats() {}

Stats.prototype.calc = function(world)
{
    this.cycle = world.currentCycle | 0;
    this.vegetation = new Sampler("vegetation");
    this.size = new Sampler("size");
    this.movePerc = new Sampler("move percent");
    this.moveMaxVeg = new Sampler("move max veg");
    this.eatPerc = new Sampler("eat percent");
    this.breedPerc = new Sampler("breed percent");
    this.breedminHealth = new Sampler("breed min health");
    this.creatures = new Sampler("creature", creatureIdToText());

    for (var row=0;row<world.size;row++) {
        for (var col=0;col<world.size;col++) {
            var cell = world.matrix[row][col];
            this.vegetation.sample(cell.vegetation);
            if (cell.creature) {
                this.creatures.sample(cell.creature.type);
                this.size.sample(cell.creature.size);
                this.movePerc.sample(cell.creature.logic.moveParams.p);
                this.moveMaxVeg.sample(cell.creature.logic.moveParams.cellVegAmountToMove);
                this.eatPerc.sample(cell.creature.logic.eatParams.p);
                this.breedPerc.sample(cell.creature.logic.breedParams.p);
                this.breedminHealth.sample(cell.creature.logic.breedParams.minHealth);
            }
        }
    }
}
Stats.prototype.toString = function()
{
    var arr = [];
    arr.push("cycle: " + utils.numberWithCommas(this.cycle));
    if (this.creatures.count) {
        arr.push("creatures: " + utils.numberWithCommas(this.creatures.count));
        arr.push(this.creatures.name + ": " + this.creatures.toString(5));
    }
    arr.push(this.vegetation.name + ": " + this.vegetation.avg().toFixed(1));
    if (this.creatures.count)
        arr.push("genes");
    addSamplerText(arr, this.size, 1);
    addSamplerText(arr, this.movePerc);
    addSamplerText(arr, this.moveMaxVeg);
    addSamplerText(arr, this.eatPerc);
    addSamplerText(arr, this.breedPerc);
    addSamplerText(arr, this.breedminHealth);
    return arr.join('\n');
}

stats = {
    calcStats: function(world) {
        var statsObj = new Stats();
        statsObj.calc(world);
        return statsObj;
    }
}
module.exports = stats