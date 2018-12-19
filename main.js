window = {};

var fs = require('fs');
var assert = require('./js/assert');
var utils = require('./js/utils');
var lifeArrays = require('./js/lifeArrays');
var creature = require('./js/creature');
var worldParams = require('./js/worldParams');
var world = require('./js/world');
var dna = require('./js/dna');
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

function printStats(myworld)
{
    console.log(stats.statsToText(stats.calcStats(myworld)));
    console.log('\n'); // 2 new lines
}

function main()
{
    initOutputFiles();

    var myworld = new world.World();
    myworld.init(350);
    myworld.addCreatures();
    var numOfCycles = 500;
    console.log("Running %d cycles\n", numOfCycles);
    for (var i=0;i<numOfCycles;i++) {
        myworld.cycle();
        writeCycleToOutputFiles(myworld);
        if (i%100 == 99 && i + 50 < numOfCycles) printStats(myworld);
    }
    printStats(myworld);
}

main();