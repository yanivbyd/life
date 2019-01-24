dna = {};
dna.DNA = function() {
}

dna.DNA.prototype._write = function(byte)
{
    assert(byte >= 0 && byte <= 255, 'byte out of range ' + byte);
    this.arr.push(byte);
}

dna.DNA.prototype._updateStr = function()
{
    this.str = this.arr.map(x => String.fromCharCode(x)).join('');
}

dna.DNA.prototype.toString = function()
{
    assert(this.str !== undefined);
    return this.str;
}

dna.DNA.prototype.fromCreatureParams = function(params)
{
    this.arr = [];
    this._write(creatureSizeToByte(params.size));
    var eatAction = getAction(params, 'eat');
    this._write(eatAction.p);
    var moveAction = getAction(params, 'move');
    this._write(moveAction.p);
    this._write(moveAction.cellVegAmountToMove);
    var breedAction = getAction(params, 'breed');
    this._write(breedAction.p);
    this._write(breedAction.minHealth);
    this._write(actionsOrderNum(params));

    this._updateStr();
}

dna.DNA.prototype.toCreatureParams = function()
{
    const arr = this.arr;

    var params = {
        size: creatureSizeFromByte(arr[0]),
        actions: [
            { t: 'eat', p: getPercentage(arr[1]) },
            { t: 'move', p: getPercentage(arr[2]), cellVegAmountToMove: arr[3] },
            { t: 'breed', p: getPercentage(arr[4]), minHealth: arr[5] },
        ]
    };
    reorderActions(params, arr[6]);
    params._dna = this;
    return params;
}

dna.DNA.prototype.equal = function(dna2)
{
    if (this.arr.length != dna2.arr.length) return false;
    for (var i=0;i<this.arr.length;i++) {
        if (this.arr[i] != dna2.arr[i]) return false;
    }
    return true;
}

function creatureSizeFromByte(byte)
{
    if (byte >= 10 && byte <= 20) return 1+(20-byte);
    return 1 + (byte % 10);
}

function creatureSizeToByte(size)
{
    assert(size > 0, size);
    return size - 1;
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
    if (p >= 100 && p <= 200) return 200-p;
    return p % 101;
}

dna.DNA.prototype.fromParents = function(dna1, dna2, hasMutation, switchParentChance)
{
    this.arr = [];
    var arr = this.arr;

    var mutationIndex = hasMutation ? utils.randomInt(dna1.arr.length) : -1;
    var arr1 = dna1.arr, arr2 = dna2.arr;
    var parent = utils.randomBool() ? arr1 : arr2;

    for (var i=0;i<dna1.arr.length;i++) {
        arr.push(parent[i]);
        if (mutationIndex == i) {
            var toAdd = utils.randomBool() ? 1 : 255;
            arr[i] = (arr[i] + toAdd) % 256;
        }
        if (utils.randomInt(switchParentChance)) {
            parent = (parent == arr1) ? arr2 : arr1;
        }
    }

    this._updateStr();
}

dna.creatureParamsForBaby = function(parent1Params, parent2Params, mutationChance, switchParentChance)
{
    switchParentChance = switchParentChance | 30;

    var dna1 = parent1Params._dna;
    var dna2 = parent2Params._dna;

    var mutation = utils.checkPercentage(mutationChance);
    var dnasEqual = dna1.equal(dna2);
    if (dnasEqual && !mutation) return parent1Params;

    var dna3 = new dna.DNA();
    dna3.fromParents(dna1, dna2, mutationChance, switchParentChance);

    return dna3.toCreatureParams();
}

dna.initDNAForCreatureParams = function(creatureParams)
{
    var dna1 = new dna.DNA(); dna1.fromCreatureParams(creatureParams);
    creatureParams._dna = dna1;
}

dna.paramsFromDNAStr = function(dnaStr)
{
    var dna1 = new dna.DNA();
    dna1.arr = dnaStr.split('').map(x => x.charCodeAt(0));
    dna1._updateStr();
    assert.equal(dnaStr, dna1.str);
    return dna1.toCreatureParams();
}

module.exports = dna;