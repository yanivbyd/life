var fs = require('fs');
var assert = require('../js/assert');
var utils = require('../js/utils');
var lifeArrays = require('../js/lifeArrays');
var creature = require('../js/creature');
var worldParams = require('../js/worldParams');
var creatureSize = require('../js/creatureSize');
var world = require('../js/world');
var stats = require('../js/stats');
var dna = require('../js/dna');
var persistent = require('../js/persistent');

var massert = require('assert');


function creature1Params()
{
    var out = {
        size: 1,
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
        size: 2,
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

describe('LifePersistency', () => {
    it('file persistency', () => {
        var world1 = new world.World();
        world1.init(60);
        world1.addCreatures();
        worldParams.rules.mutationChance = 20;
        for (var i=0;i<50;i++) world1.cycle();

        var stats1 = stats.calcStats(world1);
        if (!fs.existsSync('output')) fs.mkdirSync('output');
        persistent.saveWorldToFile(world1, 'output/world_for_test.life');

        var world2 = new world.World();
        persistent.loadWorldFromFile(world2, 'output/world_for_test.life');

        for (var i=0;i<world1.size;i++) {
            for (var j=0;j<world1.size;j++) {
                massert(world1.matrix[i][j].vegetation == world2.matrix[i][j].vegetation);
                var c1 = world1.matrix[i][j].creature;
                var c2 = world2.matrix[i][j].creature;
                if (c1) {
                    massert(!!c2);
                    massert.equal(c1.health, c2.health);
                    massert.equal(c1.type, c2.type);
                    massert.equal(c1.size, c2.size);
                    massert.equal(c1.getDNA().toString(), c2.getDNA().toString());
                }
                else
                    massert(!c2);
            }
        }

        var stats2 = stats.calcStats(world2);
        massert(world1.currentCycle, world2.currentCycle);

        if (!stats1.equals(stats2)) {
            console.error("stats1=" + stats1 + "\n\n");
            console.error("stats2=" + stats2 + "\n\n");
        }
        massert(stats1.equals(stats2));
    });
});
