lifeArrays = {
    shuffle: function(array)
    {
        // Fisher-Yates (aka Knuth) Shuffle
        var currentIndex = array.length, temporaryValue, randomIndex;
        while (currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    },

    getNearbyDeltas: function()
    {
        if (lifeArrays.cache.nearbyDeltas.length == 0) {
            lifeArrays.cache.nearbyDeltas.push({ dx: -1, dy: -1});
            lifeArrays.cache.nearbyDeltas.push({ dx: -1, dy: 0 });
            lifeArrays.cache.nearbyDeltas.push({ dx: -1, dy: 1 });
            lifeArrays.cache.nearbyDeltas.push({ dx: 0,  dy: -1});
            lifeArrays.cache.nearbyDeltas.push({ dx: 0,  dy: 1 });
            lifeArrays.cache.nearbyDeltas.push({ dx: 1,  dy: -1});
            lifeArrays.cache.nearbyDeltas.push({ dx: 1,  dy: 0 });
            lifeArrays.cache.nearbyDeltas.push({ dx: 1,  dy: 1 });
        }
        if (++lifeArrays.cache.nearbyDeltasCounter % 100 == 0) {
            lifeArrays.shuffle(lifeArrays.cache.nearbyDeltas);
            lifeArrays.cache.nearbyDeltasCounter = 0;
        }

        return lifeArrays.cache.nearbyDeltas;
    },

    cache: {
        nearbyDeltas: [],
        nearbyDeltasCounter: 0
    }
}

module.exports = lifeArrays