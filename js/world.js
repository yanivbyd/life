function Cell(vegetation)
{
    this.vegetation = vegetation;
}

function randomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function initGame(world, size)
{
    world.size = size;
    world.matrix = [];
    for(var i=0; i<size; i++) {
        world.matrix[i] = [];
        for(var j=0; j<size; j++) {
            world.matrix[i][j] = new Cell(randomInt(11));
        }
    }
}

