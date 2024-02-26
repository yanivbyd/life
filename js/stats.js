function Sampler(name, options)
{
    this.name = name;
    this.vals = {};
    this.count = 0;
    this.sum = 0;
    if (options && options.idToText) this.idToText = options.idToText;
    if (options && options.sumOnly) this.sumOnly = true;
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
    if (!isNaN(val)) this.sum += val;

    if (!this.sumOnly) {
        if (!this.vals[val]) this.vals[val] = 1;
        else this.vals[val]++;
    }
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
Sampler.prototype.equals = function(that)
{
    if (this.count != that.count || this.sum != that.sum) return false;
    for (val in this.vals) {
        if (that.vals[val] === undefined || this.vals[val] != that.vals[val]) {
            return false;
        }
    }
    return true;
}

function creatureIdToText()
{
    var idToText = {};
    for (var i=0;i<worldParams.creatures.length;i++) {
        idToText[i] = worldParams.creatures[i].name;
    }
    return idToText;
}

function creatureTextToId(name)
{
    var idToText = {};
    for (var i=0;i<worldParams.creatures.length;i++) {
        if (name == worldParams.creatures[i].name) {
            return i;
        };
    }
    return -1;
}

function addSamplerText(arr, sampler, avgFixedSize)
{
    if (!sampler.count) return;
    arr.push(sampler.name + ": "
        + sampler.avg().toFixed(avgFixedSize | 0) + " (avg) "
        + "[" + sampler.toString() + "]");
}

function setCreatureTdText(td, param, sampler, withPercent) {
    const pText = (withPercent ? '%' : '');
    if (sampler.count == 0) {
        $(td).text(param + pText);
    } else {
        $(td).text(param + pText + ' (' + sampler.avg().toFixed(1)  + ')');
    }
}

function Stats() {}

Stats.prototype.calc = function(world)
{
    this.world = world;
    this.cycle = world.currentCycle | 0;
    this.vegetation = new Sampler("vegetation", { sumOnly: true });
    this.size = new Sampler("size");
    this.movePerc = new Sampler("move percent");
    this.moveMaxVeg = new Sampler("move max veg");
    this.eatPerc = new Sampler("eat percent");
    this.breedPerc = new Sampler("breed percent");
    this.breedminHealth = new Sampler("breed min health");
    this.health = new Sampler("health");
    this.creatures = new Sampler("creature", { idToText: creatureIdToText() });
    this.byCreature = {};
    for (var i=0;i<worldParams.creatures.length;i++) {
        this.byCreature[i] = {
            params: worldParams.creatures[i],
            size: new Sampler("size"),
            movePerc: new Sampler("move percent"),
            moveMaxVeg: new Sampler("move max veg"),
            eatPerc: new Sampler("eat percent"),
            breedPerc: new Sampler("breed percent"),
            breedminHealth: new Sampler("breed min health"),
            health: new Sampler("health")
        }
    }

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
                this.health.sample(cell.creature.health);

                const samplersByCreature = this.byCreature[cell.creature.type];
                samplersByCreature.size.sample(cell.creature.size);
                samplersByCreature.movePerc.sample(cell.creature.logic.moveParams.p);
                samplersByCreature.moveMaxVeg.sample(cell.creature.logic.moveParams.cellVegAmountToMove);
                samplersByCreature.eatPerc.sample(cell.creature.logic.eatParams.p);
                samplersByCreature.breedPerc.sample(cell.creature.logic.breedParams.p);
                samplersByCreature.breedminHealth.sample(cell.creature.logic.breedParams.minHealth);
                samplersByCreature.health.sample(cell.creature.health);
            }
        }
    }

    const tds = $('#avg_tr td');
    if (tds.length > 0) {
        $(tds[1]).text('100%');
        $(tds[2]).text(this.health.avg().toFixed(1));
        $(tds[3]).text(this.size.avg().toFixed(1));
        $(tds[4]).text(this.movePerc.avg().toFixed(1) + '%');
        $(tds[5]).text(this.moveMaxVeg.avg().toFixed(1));
        $(tds[6]).text(this.breedPerc.avg().toFixed(1) + '%');
        $(tds[7]).text(this.breedminHealth.avg().toFixed(1));
        $(tds[8]).text(this.eatPerc.avg().toFixed(1) + '%');
    }

    const creaturesSampler = this.creatures;
    const creatureSamplers = this.byCreature;

    $('#genes_table tbody tr').each(function (index, tr) {
        if (index > 0) {
            const tds = $(tr).children('td');
            const creatureName = $(tr).attr('id').replace(/^creature_/, '');
            const creatureId = creatureTextToId(creatureName);
            const samplers = creatureSamplers[creatureId];
            const params = samplers.params;

            var eatParam = findActionParam(params, 'eat');
            var moveParam = findActionParam(params, 'move');
            var breedParam = findActionParam(params, 'breed');

            const count = percentage(creaturesSampler.getFreq(creatureId), creaturesSampler.count).toFixed(0) + '%';
            $(tds[1]).text(count);
            $(tds[2]).text(samplers.health.avg().toFixed(1));
            setCreatureTdText($(tds[3]), params.size, samplers.size);
            setCreatureTdText($(tds[4]), moveParam.p, samplers.movePerc, true);
            setCreatureTdText($(tds[5]), moveParam.cellVegAmountToMove, samplers.moveMaxVeg, false);
            setCreatureTdText($(tds[6]), breedParam.p, samplers.breedPerc, true);
            setCreatureTdText($(tds[7]), breedParam.minHealth, samplers.breedminHealth, true);
            setCreatureTdText($(tds[8]), eatParam.p, samplers.eatPerc, true);
        }
    });

    this.samplers = [ this.vegetation, this.size, this.movePerc, this.moveMaxVeg,
                    this.eatPerc, this.breedPerc, this.breedminHealth, this.creatures];
}

Stats.prototype.toString = function()
{
    var arr = [];
    arr.push("cycle: " + utils.numberWithCommas(this.cycle));

    if (this.creatures.count) {
        arr.push(this.creatures.toString(5));
        arr.push("");
    }

    arr.push(this.vegetation.name + ": " + this.vegetation.avg().toFixed(1));
    arr.push("creatures: " + utils.numberWithCommas(this.creatures.count));
    arr.push('births this cycle: ' + this.world.birthsThisCycle);
    arr.push('deaths this cycle: ' + this.world.deathsThisCycle);

    if (this.creatures.count) {
        arr.push(""); // New line
        arr.push("Genes:");
        arr.push("------");
    }
    addSamplerText(arr, this.size, 1);
    addSamplerText(arr, this.movePerc);
    addSamplerText(arr, this.moveMaxVeg);
    addSamplerText(arr, this.eatPerc);
    addSamplerText(arr, this.breedPerc);
    addSamplerText(arr, this.breedminHealth);

    if (this.creatures.count) {
        arr.push("");
        addSamplerText(arr, this.health);
    }
    return arr.join('\n');
}

Stats.prototype.equals = function(that)
{
    if (this.cycle != that.cycle) return false;
    assert.equal(this.samplers.length, that.samplers.length);
    for (var i=0;i<this.samplers.length;i++) {
        if (!this.samplers[i].equals(that.samplers[i])) {
            return false;
        }
    }
    return true;
}

stats = {
    calcStats: function(world) {
        var statsObj = new Stats();
        statsObj.calc(world);
        return statsObj;
    }
}
module.exports = stats