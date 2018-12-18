function WriteContext(buffer)
{
    this.buffer = buffer;
    this.pos = 0;
    this.view = new Uint8Array(this.buffer);
}

WriteContext.prototype.write = function(byte)
{
    assert(this.pos < this.buffer.byteLength);
    this.view[this.pos] = byte;
    this.pos++;
}

WriteContext.prototype.endWrites = function()
{
    assert.equal(this.pos, this.buffer.byteLength);
}

dna = {};
dna.DNA = function() {
}

dna.DNA.prototype.fromCreatureParams = function(params)
{
    var size = 9; // Fixed for now
    this.buffer = new ArrayBuffer(size);
    var ctx = new WriteContext(this.buffer);
    ctx.write(creatureSizeToByte(params.size));
    ctx.write(params.acceptBreed.p);
    ctx.write(params.acceptBreed.minHealth);
    var eatAction = getAction(params, 'eat');
    ctx.write(eatAction.p);
    var moveAction = getAction(params, 'move');
    ctx.write(moveAction.p);
    ctx.write(moveAction.cellVegAmountToMove);
    var breedAction = getAction(params, 'breed');
    ctx.write(breedAction.p);
    ctx.write(breedAction.minHealth);
    ctx.write(actionsOrderNum(params));
    ctx.endWrites();
}

dna.DNA.prototype.toCreatureParams = function()
{
    var view = new Uint8Array(this.buffer);
    var params = {
        size: creatureSizeFromByte(view[0]),
        acceptBreed: {
            p: getPercentage(view[1]),
            minHealth: getPercentage(view[2])
        },
        actions: [
            { t: 'eat', p: getPercentage(view[3]) },
            { t: 'move', p: getPercentage(view[4]), cellVegAmountToMove: view[5] },
            { t: 'breed', p: getPercentage(view[6]), minHealth: view[7] },
        ]
    };
    reorderActions(params, view[8]);
    return params;
}

dna.DNA.prototype.equal = function(dna2)
{
    if (this.buffer.byteLength != dna2.buffer.byteLength) return false;
    var view = new Uint8Array(this.buffer);
    var view2 = new Uint8Array(dna2.buffer);
    for (var i=0;i<this.buffer.byteLength;i++) {
        if (view[i] != view2[i]) return false;
    }
    return true;
}

function creatureSizeToByte(size)
{
    switch (size) {
    case "s": return 0;
    case "m": return 1;
    case "l": return 2;
    }
    assert.fail("wrong size " + size);
}

function creatureSizeFromByte(byte)
{
    switch (byte % 3) {
    case 0: return "s";
    case 1: return "m";
    case 2: return "l";
    }
}

function getAction(params, actionType)
{
    for (var i=0;i<params.actions.length;i++) {
        if (params.actions[i].t == actionType) return params.actions[i];
    }
    assert.fail("missing action type " + actionType);
}

function actionsOrderNum(params)
{
    var types = [];
    for (var i=0;i<params.actions.length;i++)
        types.push(params.actions[i].t);
    var str = types.join(',');
    if (!dna.orderCache) initOrderCache();
    var out = dna.orderCache[str];
    assert(out !== undefined);
    return out;
}

function findActionPos(params, t)
{
    for (var i=0;i<params.actions.length;i++)
        if (params.actions[i].t == t)
            return i;
    assert.fail("action not found - ", t);
}

function switchPositions(actions, pos1, pos2)
{
    var tmp = actions[pos1];
    actions[pos1] = actions[pos2];
    actions[pos2] = tmp;
}

function orderNumToOrderStr(orderNum)
{
    if (!dna.orderCache) initOrderCache();
    orderNum = orderNum % dna.orderCount;
    for (var orderStr in dna.orderCache) {
        if (dna.orderCache[orderStr] == orderNum) return orderStr;
    }
    assert.fail("Could not find orderNum " + orderNum);
}

function reorderActions(params, orderNum)
{
    var orderArr = orderNumToOrderStr(orderNum).split(',');
    for (var i=0;i<orderArr.length;i++) {
        if (params.actions[i].t != orderArr[i]) {
            var pos = findActionPos(params, orderArr[i]);
            switchPositions(params.actions, pos, i);
        }
    }
}

function initOrderCache()
{
    dna.orderCache = {};
    var counter = 0;
    dna.orderCache["eat,move,breed"] = (counter++);
    dna.orderCache["eat,breed,move"] = (counter++);
    dna.orderCache["move,eat,breed"] = (counter++);
    dna.orderCache["move,breed,eat"] = (counter++);
    dna.orderCache["breed,move,eat"] = (counter++);
    dna.orderCache["breed,eat,move"] = (counter++);
    dna.orderCount = counter;
}

function getPercentage(p)
{
    return p % 101;
}

dna.DNA.prototype.fromParents = function(dna1, dna2, hasMutation)
{
    // First simple approach, either use dna1 or dna2
    var baseDna = utils.randomBool() ? dna1 : dna2;

    this.buffer = new ArrayBuffer(baseDna.buffer.byteLength);
    var mutationIndex = hasMutation ? utils.randomInt(this.buffer.byteLength) : -1;
    var view1 = new Uint8Array(baseDna.buffer);
    var view = new Uint8Array(this.buffer);

    for (var i=0;i<this.buffer.byteLength;i++) {
        view[i] = view1[i];
        if (mutationIndex == i) {
            var toAdd = utils.randomBool() ? 1 : 255;
            view[i] = (view[i] + toAdd) % 256;
        }
    }
}

dna.creatureParamsForBaby = function(parent1Params, parent2Params, mutationChance)
{
    var dna1 = new dna.DNA(); dna1.fromCreatureParams(parent1Params);
    var dna2 = new dna.DNA(); dna2.fromCreatureParams(parent2Params);

    var mutation = utils.checkPercentage(mutationChance);
    var dnasEqual = dna1.equal(dna2);
    if (dnasEqual && !mutation) return parent1Params;

    var dna3 = new dna.DNA();
    dna3.fromParents(dna1, dna2, mutationChance);

    return dna3.toCreatureParams();
}

module.exports = dna;