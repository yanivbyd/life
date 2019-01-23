var assert = require('../js/assert');
var utils = require('../js/utils');
var lifeArrays = require('../js/lifeArrays');
var creature = require('../js/creature');
var worldParams = require('../js/worldParams');
var creatureSize = require('../js/creatureSize');
var world = require('../js/world');
var stats = require('../js/stats');
var dna = require('../js/dna');

var massert = require('assert');


function creature1Params()
{
    var out = {
        size: 0,
        actions: [
            { t: 'eat', p: 100 },
            { t: 'breed', p: 33, minHealth: 5 },
            { t: 'move', p: 50, cellVegAmountToMove: 6 }
        ]
    };
    dna.initDNAForCreatureParams(out);
    return out;
}

function creature2Params()
{
    var out = {
        size: 1,
        actions: [
            { t: 'breed', p: 12, minHealth: 5 },
            { t: 'eat', p: 80 },
            { t: 'move', p: 50, cellVegAmountToMove: 6 }
        ]
    }
    dna.initDNAForCreatureParams(out);
    return out;
}

describe('Life', () => {
    var myworld = new world.World();
    myworld.init(50);
    myworld.addCreatures();
    var statStr = stats.calcStats(myworld).toString();
    it('stat checking, cycle 0', () => {
        massert(statStr.indexOf('red') > -1);
        massert(statStr.indexOf('health') > -1);
        massert(statStr.indexOf('vegetation') > -1);
        massert(statStr.indexOf('cycle: 0') > -1);
    });


    myworld.cycle();
    var statStr2 = stats.calcStats(myworld).toString();
    it('stat checking, cycle 1', () => {
        massert(statStr2.indexOf('red') > -1);
        massert(statStr2.indexOf('health') > -1);
        massert(statStr2.indexOf('vegetation') > -1);
        massert(statStr2.indexOf('cycle: 1') > -1);
    });

    var creature = myworld.findCreature();
    it('creature params', () => {
        massert(creature.health > 0);
        massert(!!creature.logic.params.actions.length);
        massert(!!creature.logic.params.name);
        massert(!!creature.logic.params.size);
    });

    var mydna = new dna.DNA();
    var params = creature.logic.params;
    mydna.fromCreatureParams(params);
    var params2 = mydna.toCreatureParams();

    it('creature dna serialization-desrialization', () => {
        massert.equal(mydna.arr.length, 7);
        massert.equal(params.actions.size, params2.actions.size);
        for (var i=0;i<params.actions.size;i++)
            massert.equal(params.actions[i].t, params2.actions[i].t);
    });

    // breed 2 creatures
    var babyParams = dna.creatureParamsForBaby(creature1Params(), creature2Params(), false);
    var babyParamsMut = dna.creatureParamsForBaby(creature1Params(), creature2Params(), true);

    it('breeding creatures', () => {
        massert(babyParams.actions.length > 0);
        massert(babyParamsMut.actions.length > 0);
        massert(babyParams.actions[0].p !== undefined);
        massert(babyParamsMut.actions[0].p !== undefined);
    });
});

