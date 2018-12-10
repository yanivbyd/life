utils = {
    randomInt: function(max)
    {
        return Math.floor(Math.random() * Math.floor(max));
    },

    randomPercentage: function(perc)
    {
        return utils.randomInt(100) < perc;
    },

    randomArrayItem: function(arr)
    {
        if (arr.length == 0) return null;
        if (arr.length == 1) return arr[0];
        return arr[utils.randomInt(arr.length)];
    },

    numberWithCommas: function(num)
    {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    shortNumber: function(num)
    {
        if (num>10*1000*1000) return Math.floor(num/1000000) + "m";
        if (num>10*1000) return Math.floor(num/1000) + "k";
        return num;
    },

    checkPercentage: function(p)
    {
        if (p == 0) return false;
        if (p == 100) return true;
        return utils.randomInt(100) > p;
    }
}

module.exports = utils