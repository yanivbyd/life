global_nearby_deltas = [];
global_nearby_deltas_counter = 0;

function shuffle_array(array)
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
}

function get_nearby_deltas()
{
    if (global_nearby_deltas.length == 0) {
        global_nearby_deltas.push({ dx: -1, dy: -1});
        global_nearby_deltas.push({ dx: -1, dy: 0 });
        global_nearby_deltas.push({ dx: -1, dy: 1 });
        global_nearby_deltas.push({ dx: 0,  dy: -1});
        global_nearby_deltas.push({ dx: 0,  dy: 1 });
        global_nearby_deltas.push({ dx: 1,  dy: -1});
        global_nearby_deltas.push({ dx: 1,  dy: 0 });
        global_nearby_deltas.push({ dx: 1,  dy: 1 });
    }
    if (++global_nearby_deltas_counter % 100 == 0) {
        shuffle_array(global_nearby_deltas);
        global_nearby_deltas_counter = 0;
    }

    return global_nearby_deltas;
}