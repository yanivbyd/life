window = {};

var fs = require('fs');
var assert = require('./js/assert');
var utils = require('./js/utils');
var lifeArrays = require('./js/lifeArrays');
var creature = require('./js/creature');
var worldParams = require('./js/worldParams');
var world = require('./js/world');
var stats = require('./js/stats');

function initOutputFiles()
{
    var dir = 'output';
    var vegFile = 'output/veg.csv', creaturesFile = 'output/creatures.csv';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    if (fs.existsSync(vegFile)) fs.unlinkSync(vegFile);
    if (fs.existsSync(creaturesFile)) fs.unlinkSync(creaturesFile);

    fs.appendFileSync(vegFile, ['cycle','veg'].join(',')+'\n');

    var names = ['cycle'];
    for (var i=0;i<worldParams.creatures.length;i++)
        names.push(worldParams.creatures[i].name);
    fs.appendFileSync(creaturesFile, names.join(',')+'\n');
}

function writeCycleToOutputFiles(myworld)
{
    var vegFile = 'output/veg.csv', creaturesFile = 'output/creatures.csv';
    var statsObj = stats.calcStats(myworld);
    fs.appendFileSync(vegFile, [statsObj.cycle, statsObj.vegetation.avg()].join(',')+'\n');

    var creaturesRow = [statsObj.cycle];
    for (var i=0;i<worldParams.creatures.length;i++) {
        creaturesRow.push(statsObj.creatures[i].count);
    }
    fs.appendFileSync(creaturesFile, creaturesRow.join(',')+'\n');
}

function main() {
    initOutputFiles();

    var myworld = new world.World();
    myworld.init(350);
    myworld.addCreatures();
    var numOfCycles = 500;
    for (var i=0;i<numOfCycles;i++) {
        if (i%100 == 0) process.stdout.write('running cycle ' + i + ' out of ' + numOfCycles + '\r');
        myworld.cycle();
        writeCycleToOutputFiles(myworld);
    }
    process.stdout.write('\r                                        \n');
    console.log(stats.statsToText(stats.calcStats(myworld)));
}

main();