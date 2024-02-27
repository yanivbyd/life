var global_veg_colors = [];

function initVegColors(world, veg_colors)
{
    if (veg_colors.length > 0) return; // already initialized

    var start_color = [255,255,255];
    var end_color = [38,255,0];

    world.initMaxVegetation();
    var max_veg = world.maxVegetation;

    for (var i=0;i<=max_veg;i++) veg_colors[i] = [];
    var incArr = [];
    for (var j=0;j<3;j++) incArr[j] = (end_color[j]-start_color[j]) / max_veg;
    for (var i=0;i<=max_veg;i++) {
        for (var j=0;j<3;j++) {
            veg_colors[i][j] = start_color[j] + incArr[j] * i;
        }
    }
}

function renderVegetation(data, i, vegetation)
{
    var vegColor = global_veg_colors[Math.floor(vegetation)];
    for (var j=0;j<3;j++) data[i+j] = vegColor[j]; // r,g,b
}

function renderCreature(data, i, creature)
{
    var color = worldParams.rendering.creatures[creature.type];
    data[i] = color[0];
    data[i+1] = color[1];
    data[i+2] = color[2];
}

function renderCanvas(canvas, world)
{
    initVegColors(world, global_veg_colors);

    var ctx = canvas.getContext('2d');
    var width = $(canvas).width();
    var imageData = ctx.createImageData($(canvas).width(), $(canvas).height());
    var data = imageData.data;

    for (var i = 0; i < data.length; i += 4) {
        var row = Math.floor((i/4) / width);
        var col = Math.floor((i/4) % width);
        var cell = world.matrix[row][col];
        data[i+3] = 255; // alpha
        if (cell.creature) {
            renderCreature(data, i, cell.creature);
        } else {
            renderVegetation(data, i, cell.vegetation);
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

function buildGenesTable(table) {
    const tHead = $('<thead/>');
    const topTR = $('<tr/>').appendTo(tHead);
    $('<td/>').text('name').appendTo(topTR);
    $('<td/>').text('count').appendTo(topTR);
    $('<td/>').text('health').appendTo(topTR);
    $('<td/>').text('size').appendTo(topTR);
    $('<td/>').text('move').appendTo(topTR);
    $('<td/>').text('max veg (move)').appendTo(topTR);
    $('<td/>').text('breed').appendTo(topTR);
    $('<td/>').text('min health (breed)').appendTo(topTR);
    $('<td/>').text('deaths').appendTo(topTR);
    $('<td/>').text('births').appendTo(topTR);
    $('<td/>').text('kills').appendTo(topTR);

    const tBody = $('<tbody/>');

    const avgTR = $('<tr/>').attr('id', 'avg_tr').appendTo(tBody);
    topTR.children('td').each(function(index, element) {
        $('<td/>').appendTo(avgTR);
    });

    avgTR.children('td').first().text('average/total');

    worldParams.creatures.forEach(function(param) {
        const tr = $('<tr/>').attr('id', 'creature_' + param.name).appendTo(tBody);
        $('<td/>').text(param.name).appendTo(tr);
        $('<td/>').addClass('creature_count').appendTo(tr);
        $('<td/>').appendTo(tr);
        $('<td/>').text(param.size).appendTo(tr);
        var eatParam = findActionParam(param, 'eat');
        var moveParam = findActionParam(param, 'move');
        var breedParam = findActionParam(param, 'breed');
        $('<td/>').text(moveParam ? moveParam.p + '%' : '').appendTo(tr);
        $('<td/>').text(moveParam ? moveParam.cellVegAmountToMove : '').appendTo(tr);
        $('<td/>').text(breedParam ? breedParam.p + '%' : '').appendTo(tr);
        $('<td/>').text(breedParam ? breedParam.minHealth : '').appendTo(tr);
        $('<td/>').appendTo(tr);
        $('<td/>').appendTo(tr);
        $('<td/>').appendTo(tr);
    });

    table.append(tHead);
    table.append(tBody);
}

function findActionParam(param, actionName) {
    for (var i in param.actions) {
        if (param.actions[i].t == actionName) {
            return param.actions[i];
        }
    }
}