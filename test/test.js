var assert = require('../js/assert');
var utils = require('../js/utils');
var lifeArrays = require('../js/lifeArrays');
var creature = require('../js/creature');
var worldParams = require('../js/worldParams');
var world = require('../js/world');
var stats = require('../js/stats');

var massert = require('assert');
describe('Life', function() {
    var myworld = new world.World();
    myworld.init(50);
    myworld.addCreatures();
    var statStr = stats.statsToText(stats.calcStats(myworld));
    it('stat checking, cycle 0', function() {
        massert.notEqual(statStr.indexOf('red'), -1);
        massert.notEqual(statStr.indexOf('health'), -1);
        massert.notEqual(statStr.indexOf('vegetation'), -1);
        massert.notEqual(statStr.indexOf('cycle: 0'), -1);
    });
    myworld.cycle();
    var statStr2 = stats.statsToText(stats.calcStats(myworld));
    it('stat checking, cycle 1', function() {
        massert.notEqual(statStr2.indexOf('red'), -1);
        massert.notEqual(statStr2.indexOf('health'), -1);
        massert.notEqual(statStr2.indexOf('vegetation'), -1);
        massert.notEqual(statStr2.indexOf('cycle: 1'), -1);
    });
});

