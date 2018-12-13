function WriteContext(buffer) {
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
}

function getPercentage(p)
{
    return p % 101;
}

module.exports = dna;