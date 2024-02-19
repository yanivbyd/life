function cacheValue(size, cacheName, formula)
{
    if (!creatureSize.cache) creatureSize.cache = {};
    if (!creatureSize.cache[cacheName]) creatureSize.cache[cacheName] = {};
    var cache = creatureSize.cache[cacheName];
    if (cache[size] === undefined) {
        cache[size] = eval(formula.replace("size", size));
    }
    return cache[size];
}

creatureSize = {
    initialHealth: function(size)
    {
        return cacheValue(size, "initialHealth", worldParams.rules.addCreatures.initialHealth);
    },
    maxHealth: function(size)
    {
        return cacheValue(size, "maxHealth", worldParams.rules.creatureMaxHealth);
    },
    eating: function(size)
    {
        return cacheValue(size, "eating", worldParams.rules.eating);
    },
    penaltyBreathing: function(size)
    {
        return cacheValue(size, "penaltyBreathing", worldParams.rules.penalties.breathing);
    },

};
module.exports = creatureSize