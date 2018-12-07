function renderSummary(textbox, world)
{
    var creaturesCount = [];
    for (var i=0;i<global_world_params.creatures.length;i++)
        creaturesCount.push(0);

    for (var row=0;row<world.size;row++)
        for (var col=0;col<world.size;col++) {
            var cell = world.matrix[row][col];
            if (cell.creature) creaturesCount[cell.creature.type]++;
        }

    var text = "";
    for (var i=0;i<global_world_params.creatures.length;i++) {
        text += "creature ["+i+"]: count="+creaturesCount[i]+"\n";
    }
    $(textbox).text(text);
}