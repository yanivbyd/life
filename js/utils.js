function randomInt(max)
{
    return Math.floor(Math.random() * Math.floor(max));
}

function randomPercentage(perc)
{
    return randomInt(100) < perc;
}
