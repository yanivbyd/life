var program = require('commander');

program
    .version('1.0')
    .option('-c, --cycles <count>', 'Number of cycles (required)', parseInt)
    .option('-g, --graph', 'Save output graph file')
    .option('-s, --single-creature <type>', 'Run with a single creature')
    .parse(process.argv);

if (!program.cycles) {
    program.outputHelp();
    return;
}

window = {};

var fs = require('fs');
var assert = require('./js/assert');
var utils = require('./js/utils');
var lifeArrays = require('./js/lifeArrays');
var creature = require('./js/creature');
var worldParams = require('./js/worldParams');
var creatureSize = require('./js/creatureSize');
var world = require('./js/world');
var dna = require('./js/dna');
var stats = require('./js/stats');

function initOutputFiles()
{
    var dir = 'output';
    var vegFile = 'output/veg.csv', creaturesFile = 'output/creatures.csv', genesFile = 'output/genes.csv';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    if (fs.existsSync(vegFile)) fs.unlinkSync(vegFile);
    if (fs.existsSync(creaturesFile)) fs.unlinkSync(creaturesFile);
    if (fs.existsSync(genesFile)) fs.unlinkSync(genesFile);

    fs.appendFileSync(vegFile, ['cycle','veg'].join(',')+'\n');

    var names = ['cycle'];
    for (var i=0;i<worldParams.creatures.length;i++)
        names.push(worldParams.creatures[i].name);
    fs.appendFileSync(creaturesFile, names.join(',')+'\n');

    fs.appendFileSync(genesFile, "cycle,size,move percent,move max veg,eat percent,breed percent,breed min health\n");
}

function writeCycleToOutputFiles(myworld)
{
    var vegFile = 'output/veg.csv', creaturesFile = 'output/creatures.csv', genesFile = 'output/genes.csv';
    var statsObj = stats.calcStats(myworld);
    fs.appendFileSync(vegFile, [statsObj.cycle, statsObj.vegetation.avg()].join(',')+'\n');

    var creaturesRow = [statsObj.cycle];
    for (var i=0;i<worldParams.creatures.length;i++) {
        creaturesRow.push(statsObj.creatures.getFreq(i));
    }
    fs.appendFileSync(creaturesFile, creaturesRow.join(',')+'\n');

    var genesRow = [
        statsObj.cycle,
        statsObj.size.avg(),
        statsObj.movePerc.avg(),
        statsObj.moveMaxVeg.avg(),
        statsObj.eatPerc.avg(),
        statsObj.breedPerc.avg(),
        statsObj.breedminHealth.avg(),
    ];
    fs.appendFileSync(genesFile, genesRow.join(',')+'\n');
}

function printStats(myworld)
{
    console.log(stats.calcStats(myworld).toString());
    console.log('\n'); // 2 new lines
}

function main()
{
    initOutputFiles();

    var myworld = new world.World();
    myworld.init(350);
    if (program.singleCreature)
        myworld.addCreatures(program.singleCreature);
    else
        myworld.addCreatures();
    var numOfCycles = program.cycles || 500;
    console.log("Running %d cycles\n", numOfCycles);
    for (var i=0;i<numOfCycles;i++) {
        myworld.cycle();
        if (program.graph) writeCycleToOutputFiles(myworld);
        if (i%100 == 99 && i + 50 < numOfCycles) printStats(myworld);
    }
    printStats(myworld);
}

main();