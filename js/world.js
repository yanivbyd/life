function Cell(env)
{
    this.env = { vegMaxAmount: env.vegMaxAmount, rain: env.rain };
    this.vegetation = utils.randomInt(env.vegMaxAmount+1);
}

function World()
{
}

World.prototype.initMaxVegetation = function()
{
    this.maxVegetation = worldParams.environment.vegMaxAmount;
}

World.prototype.initAreas = function()
{
    for(var i=0; i<this.size; i++) {
        for (var j = 0; j < this.size; j++) {
            this.matrix[i][j] = new Cell(worldParams.environment);
        }
    }
    initRandomAreas(this);
}

function replaceRandom(expression) {
    var regex = /random\((\d+),(\d+)\)/g;

    return expression.replace(regex, function(match, min, max) {
        return random(parseInt(min), parseInt(max)).toString();
    });
}

function evalRandomValues(obj) {
    for (field in obj) {
        switch (typeof obj[field]) {
            case 'string':
                if (obj[field].indexOf('random(') > -1) {
                    obj[field] = replaceRandom(obj[field]);
                }
                break;
            case 'object':
                evalRandomValues(obj[field]);
                break;
            case 'array':
                for (let item in obj[field]) {
                    evalRandomValues(item);
                }
                break;
        }
    }
}

function removeHiddenFields(obj) {
    for (field in obj) {
        if (field.indexOf("_") == 0) {
            delete obj[field];
            continue;
        }
        switch (typeof obj[field]) {
            case 'object':
                removeHiddenFields(obj[field]);
                break;
            case 'array':
                for (let item in obj[field]) {
                    removeHiddenFields(item);
                }
                break;
        }
    }
}

function showObjectRemoveHidden(obj) {
    const clone = JSON.parse(JSON.stringify(obj));
    removeHiddenFields(clone);
    return JSON.stringify(clone, null, 2)
}

World.prototype.rulesSummary = function() {
    let result = [];
    result.push('Rules');
    result.push('---------');
    result.push(showObjectRemoveHidden(worldParams.rules));

    return result.join('\n');
}

World.prototype.init = function(size)
{
    evalRandomValues(worldParams.rules);
    evalRandomValues(worldParams.creatures);
    
    this.currentCycle = 0;
    this.size = size;
    this.nextCycle = this.currentCycle + 1;
    this.matrix = [];
    this.rainDelta = 0;
    for(var i=0; i<size; i++) {
        this.matrix[i] = [];
    }

    this.initAreas();
    this.addCreatures();
}

World.prototype.isValidIndex = function(index) {
    return index >= 0 && index < this.size;
}

World.prototype.nearCells = function(row, col)
{
    var deltas = lifeArrays.getNearbyDeltas();
    var cells = [];
    for (var i=0;i<deltas.length;i++) {
        var row1 = row+deltas[i].dy;
        var col1 = col+deltas[i].dx;
        if (this.isValidIndex(row1) && this.isValidIndex(col1)) {
            cells.push(this.matrix[row1][col1]);
        }
    }
    return cells;
}

World.prototype.findPosFromNearby = function(row, col, cell)
{
    var deltas = lifeArrays.getNearbyDeltas();
    for (var i=0;i<deltas.length;i++) {
        var row1 = row+deltas[i].dy;
        var col1 = col+deltas[i].dx;
        if (this.isValidIndex(row1) && this.isValidIndex(col1)) {
            if (this.matrix[row1][col1] === cell) {
                return { row: row1, col: col1 };
            }
        }
    }
    panic("Cell not nearby " + row + "," + col);
}

World.prototype.addCreatures = function(singleType)
{
    for (var i=0;i<worldParams.creatures.length;i++) {
        if (singleType && worldParams.creatures[i].name != singleType) continue;
        this.addCreaturesOfType(i);
    }
}

World.prototype.addCreaturesOfType = function(type)
{
    var creatureAmount = worldParams.rules.addCreatures.amount;
    var maxTries = creatureAmount * 10, try_count = 0;
    dna.initDNAForCreatureParams(worldParams.creatures[type]);
    var creatureLogic = new creature.CreatureLogic(worldParams.creatures[type]);
    var size = creatureLogic.params.size;

    while (creatureAmount>0 && try_count < maxTries) {
        var cell = this.matrix[utils.randomInt(this.size)][utils.randomInt(this.size)];
        if (!cell.creature) {
            var health = creatureSize.initialHealth(size);
            cell.creature = new creature.Creature(health, type, creatureLogic);
            creatureAmount--;
        }
        try_count++;
    }
}

World.prototype.findCreature = function()
{
    for(var i=0; i<this.size; i++) {
        for(var j=0; j<this.size; j++) {
            if (this.matrix[i][j].creature)
                return this.matrix[i][j].creature;
        }
    }
}

function cycleVegetation(cell, rainDelta)
{
    cell.vegetation += (cell.env.rain + rainDelta);
    cell.vegetation = Math.max(0, Math.min(cell.vegetation, cell.env.vegMaxAmount));
}

World.prototype.cycle = function()
{
    this.currentCycle = this.nextCycle;
    this.nextCycle++;
    this.stats = {};
    var cycleCtx = new creature.CycleContext(this);
    for(var i=0; i<this.size; i++) {
        for(var j=0; j<this.size; j++) {
            cycleCtx.nextCell(i,j);
            var cell = this.matrix[i][j];
            cycleVegetation(cell, this.rainDelta);
            if (cell.creature) cell.creature.cycle(cycleCtx);
        }
    }
    if (!this.cycleOfNextEvent) {
        this.cycleOfNextEvent = 50;
    }
    if (this.currentCycle == this.cycleOfNextEvent) {
        this.cycleOfNextEvent = this.currentCycle + random(50,200);
        const eventType = utils.randomInt(5);
        switch (eventType) {
            case 0:
                this.rainDelta++;
                $('#change').text('more rain (delta='+ this.rainDelta+')');
                break;
            case 1:
                if (this.rainDelta > -2) {
                    this.rainDelta--;
                    $('#change').text('less rain (delta=' + this.rainDelta + ')');
                }
                break;
            case 2:
                $('#change').text('more creatures');
                this.addCreatures();
                break;
            case 3:
                worldParams.rules.penalties.moving += 2;
                $('#change').text('move penalty increase (val='+ worldParams.rules.penalties.moving + ')');
                break;
            case 4:
                worldParams.rules.penalties.moving -= 2;
                $('#change').text('move penalty decrease (val='+ worldParams.rules.penalties.moving + ')');
                break;
        }
        setTimeout(function () {
            $('#change').text('');
        }, 4000);
    }
}

World.prototype.incCycleStats = function(statName, creatureType) {
    this.stats.global = this.stats.global || {};
    this.stats.global[statName] = this.stats.global[statName] || 0;
    this.stats.perType = this.stats.perType || {};
    this.stats.perType[creatureType] = this.stats.perType[creatureType] || {};
    this.stats.perType[creatureType][statName] = this.stats.perType[creatureType][statName] || 0;

    this.stats.global[statName]++;
    this.stats.perType[creatureType][statName]++;
}

World.prototype.getStatPerType = function(statName, creatureType) {
    if (this.stats.perType && this.stats.perType[creatureType]) {
        return this.stats.perType[creatureType][statName] || 0;
    }
    return 0;
}

World.prototype.getStat = function(statName) {
    if (this.stats.global) {
        return this.stats.global[statName] || 0;
    }
    return 0;
}

module.exports = {
    World: function() { return new World(); },
    Cell: function() { return new Cell(); }
}