window = {};

var fs = require('fs');
var assert = require('../js/assert');
var utils = require('../js/utils');
var lifeArrays = require('../js/lifeArrays');
var creature = require('../js/creature');
var worldParams = require('../js/worldParams');
var world = require('../js/world');
var stats = require('../js/stats');

function initOutputFiles()
{
    var dir = 'output';
    var cyclesFile = 'output/cycles.csv';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    if (fs.existsSync(cyclesFile)) fs.unlinkSync(cyclesFile);
    fs.appendFileSync(cyclesFile, 'cycle,veg\n');
}

function writeCycleToOutputFiles(myworld)
{
    var cyclesFile = 'output/cycles.csv';
    var statsObj = stats.calcStats(myworld);
    fs.appendFileSync(cyclesFile, myworld.cycles + ', '
        + statsObj.vegetation.avg() + '\n');
}

function main() {
    initOutputFiles();

    var myworld = new world.World();
    myworld.init(100);
    myworld.cycle();
    myworld.addCreatures();
    var numOfCycles = 1000;
    for (var i=0;i<numOfCycles;i++) {
        if (i%100 == 0) process.stdout.write('running cycle ' + i + ' out of ' + numOfCycles + '\r');
        myworld.cycle();
        writeCycleToOutputFiles(myworld);
    }
    process.stdout.write('\r                                        \n');
    console.log(stats.statsToText(myworld, stats.calcStats(myworld)));
}

main();