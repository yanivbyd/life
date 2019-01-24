var fs = require('fs');

var DNA_STRING_SIZE = 7;

function writeInt32(file, val, buffer)
{
    if (buffer === undefined) buffer = Buffer.alloc(4);
    buffer.writeInt32BE(val, 0);
    fs.appendFileSync(file.fd, buffer);
}

function readInt32(file, buffer)
{
    if (buffer === undefined) buffer = Buffer.alloc(4);
    const dataRead = fs.readSync(file.fd, buffer, 0, 4, file.position);
    assert.equal(dataRead, 4);
    file.position += dataRead;
    return buffer.readInt32BE(0);
}

function writeString(file, str)
{
    fs.appendFileSync(file.fd, str, 'ascii');
}

function readString(file, length, buffer)
{
    if (buffer === undefined) buffer = Buffer.alloc(length);
    const dataRead = fs.readSync(file.fd, buffer, 0, length, file.position);
    assert.equal(dataRead, length);
    file.position += dataRead;
    var arr = [];
    for (const x of buffer) arr.push(String.fromCharCode(x));
    return arr.join('');
}

function writeMatrix(file, w, dnas)
{
    var buffer = Buffer.alloc(4);
    const size = w.size;
    writeInt32(file, size, buffer);

    for (var i=0;i<size;i++) {
        for (var j=0;j<size;j++) {
            const cell = w.matrix[i][j]
            writeInt32(file, cell.vegetation, buffer);
            writeInt32(file, cell.creature ? 1 : 0, buffer);
            if (cell.creature) {
                writeCreature(file, cell.creature, buffer);
            }
        }
    }
}

function readMatrix(file, w, cycle)
{
    var creatureLogicCache = {};

    var buffer = Buffer.alloc(4);
    var dnaBuffer = Buffer.alloc(DNA_STRING_SIZE);
    const size = readInt32(file, buffer);
    w.initEmpty(size);
    w.currentCycle = cycle;

    for (var pos = 0; pos < size * size; pos++) {
        var i = Math.floor(pos / size);
        var cell = w.matrix[i][pos % size];
        cell.vegetation = readInt32(file, buffer);
        const hasCreature = readInt32(file, buffer);
        assert(hasCreature == 0 || hasCreature == 1);
        if (hasCreature) cell.creature = readCreature(file, buffer, dnaBuffer, creatureLogicCache);
    }
}

function writeCreature(file, myCreature, buffer)
{
    writeInt32(file, myCreature.type, buffer);
    writeInt32(file, myCreature.health, buffer);
    const dnaStr = myCreature.getDNA().toString();
    assert.equal(dnaStr.length, DNA_STRING_SIZE);
    writeString(file, dnaStr);
}

function readCreature(file, buffer, dnaBuffer, creatureLogicCache)
{
    const type = readInt32(file, buffer);
    const health = readInt32(file, buffer);
    const dnaStr = readString(file, DNA_STRING_SIZE, dnaBuffer);

    var creatureLogic = creatureLogicCache[dnaStr];
    if (creatureLogic === undefined) {
        creatureLogic = new creature.CreatureLogic(dna.paramsFromDNAStr(dnaStr));
        creatureLogicCache[dnaStr] = creatureLogic;
    }
    return new creature.Creature(health, type, creatureLogic);
}

persistent = {
    saveWorldToFile: function(w, fileName) {
        var file = {
            fd: fs.openSync(fileName, 'w')
        };
        try {
            writeInt32(file, w.currentCycle);
            writeMatrix(file, w);
        } finally {
            fs.closeSync(file.fd);
        }
    },
    loadWorldFromFile: async function(w, fileName) {
        var file = {
            fd: fs.openSync(fileName, 'r'),
            position: 0
        };
        const cycle = readInt32(file);
        readMatrix(file, w, cycle);
        fs.closeSync(file.fd);
    }
}

module.exports = persistent

