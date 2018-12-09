var global_veg_colors = [];

function initVegColors(veg_colors)
{
    if (veg_colors.length > 0) return; // already initialized

    var start_color = [255,255,255];
    var end_color = [38,255,0];
    var max_veg = global_world_params.veg.maxAmount;

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
    var color = global_world_params.rendering.creatures[creature.type];
    data[i] = color[0];
    data[i+1] = color[1];
    data[i+2] = color[2];
}

function renderCanvas(canvas, world)
{
    initVegColors(global_veg_colors);

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
