window = {};
var assert = require('../js/assert');
var utils = require('../js/utils');
var lifeArrays = require('../js/lifeArrays');
var creature = require('../js/creature');
var worldParams = require('../js/worldParams');
var world = require('../js/world');
var renderSummary = require('../js/renderSummary');

var w = new world.World();
w.init(100);
w.cycle();
w.addCreatures();
var numOfCycles = 1000;
for (var i=0;i<numOfCycles;i++) {
    if (i%100 == 0) process.stdout.write('running cycle ' + i + ' out of ' + numOfCycles + '\r');
    w.cycle();
}
process.stdout.write('\r');
console.log(renderSummary(w));
