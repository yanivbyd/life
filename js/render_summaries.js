function SamplingGroup(histMax)
{
    this.histMax = histMax;
    this.sum = 0;
    this.count = 0;
}

SamplingGroup.prototype.sample = function(val)
{
    this.count++;
    this.sum += val;
}

SamplingGroup.prototype.toString = function()
{
    var out = [];
    out.push("count=" + this.count);
    if (this.sum) {
        var avg = this.sum / this.count;
        out.push("avg="+avg.toFixed(2));
    }
    return out.join(", ");
}


function renderSummary(textbox, world)
{
    var creatures = [];
    for (var i=0;i<global_world_params.creatures.length;i++) {
        creatures.push(new SamplingGroup(global_world_params.creature.maxHealth));
    }

    for (var row=0;row<world.size;row++)
        for (var col=0;col<world.size;col++) {
            var cell = world.matrix[row][col];
            if (cell.creature) creatures[cell.creature.type].sample(cell.creature.health);
        }

    var text = "";
    for (var i=0;i<global_world_params.creatures.length;i++) {
        text += "creature ["+(i+1)+"]: "+ creatures[i].toString()+"\n";
    }
    $(textbox).text(text);
}