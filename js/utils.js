function randomInt(max)
{
    return Math.floor(Math.random() * Math.floor(max));
}

function randomPercentage(perc)
{
    return randomInt(100) < perc;
}

function randomArrayItem(arr)
{
    if (arr.length == 0) return null;
    if (arr.length == 1) return arr[0];
    return arr[randomInt(arr.length)];
}