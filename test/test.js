var assert = require('../js/assert');
var utils = require('../js/utils');
var lifeArrays = require('../js/lifeArrays');
var creature = require('../js/creature');
var worldParams = require('../js/worldParams');
var world = require('../js/world');
var stats = require('../js/stats');
var dna = require('../js/dna');

var massert = require('assert');
describe('Life', function() {
    var myworld = new world.World();
    myworld.init(50);
    myworld.addCreatures();
    var statStr = stats.statsToText(stats.calcStats(myworld));
    it('stat checking, cycle 0', function() {
        massert(statStr.indexOf('red') > -1);
        massert(statStr.indexOf('health') > -1);
        massert(statStr.indexOf('vegetation') > -1);
        massert(statStr.indexOf('cycle: 0') > -1);
    });


    myworld.cycle();
    var statStr2 = stats.statsToText(stats.calcStats(myworld));
    it('stat checking, cycle 1', function() {
        massert(statStr2.indexOf('red') > -1);
        massert(statStr2.indexOf('health') > -1);
        massert(statStr2.indexOf('vegetation') > -1);
        massert(statStr2.indexOf('cycle: 1') > -1);
    });

    var creature = myworld.findCreature();
    it('creature params', function() {
        massert(creature.health > 0);
        massert(!!creature.logic.params.actions.length);
        massert(!!creature.logic.params.name);
        massert(!!creature.logic.params.size);
    });

    var mydna = new dna.DNA();
    var params = creature.logic.params;
    mydna.fromCreatureParams(params);
    var params2 = mydna.toCreatureParams();

    it('creature dna serialization-desrialization', function() {
        massert.equal(mydna.buffer.byteLength, 9);
        massert.equal(params.actions.size, params2.actions.size);
        for (var i=0;i<params.actions.size;i++)
            massert.equal(params.actions[i].t, params2.actions[i].t);
    });
});

