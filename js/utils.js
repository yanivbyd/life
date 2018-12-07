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

function numberWithCommas(num)
{
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function shortNumber(num)
{
    if (num>10*1000*1000) return Math.floor(num/1000000) + "m";
    if (num>10*1000) return Math.floor(num/1000) + "k";
    return num;
}