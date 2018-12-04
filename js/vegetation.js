function cycleVegetation(cell)
{
    cell.vegetation += global_world_params.veg.rain;
    cell.vegetation = Math.min(cell.vegetation, global_world_params.veg.maxAmount);
}

