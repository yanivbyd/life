function Cell(vegetation)
{
    this.vegetation = vegetation;
}

function cycleCell(matrix, row, col)
{
    var cell = matrix[row][col];
    cycleVegetation(cell);
}

function randomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function initGame(world, size)
{
    world.size = size;
    world.cycles = 0;
    world.matrix = [];
    for(var i=0; i<size; i++) {
        world.matrix[i] = [];
        for(var j=0; j<size; j++) {
            world.matrix[i][j] = new Cell(randomInt(maxVegetation()+1));
        }
    }
}

function cycleWorld(world)
{
    for(var i=0; i<world.size; i++) {
        for(var j=0; j<world.size; j++) {
            cycleCell(world.matrix, i , j);
        }
    }
    world.cycles++;
}