function cycleVegetation(cell)
{
    cell.vegetation++;  // rain
    cell.vegetation = Math.min(cell.vegetation, maxVegetation());
}

function maxVegetation()
{
    return 10;
}