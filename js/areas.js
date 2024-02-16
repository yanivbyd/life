
function toValidIndex(world, index) {
    if (index < 0) return index;
    return Math.min(index, world.size-1);
}
function areaRectangle(world, env, x, y, width, height) {
    for (var i=y; i<= toValidIndex(world, y+height); i++) {
        for (var j=x; j<=toValidIndex(world, x+width); j++) {
            world.matrix[i][j] = new Cell(env);
        }
    }
}

function areaCircle(world, env, x, y, radius) {
    for (let i = toValidIndex(world, y-radius); i < toValidIndex(world, y+radius); i++) {
        for (let j = toValidIndex(world, x-radius); j < toValidIndex(world, x+radius); j++) {
            const distance = Math.sqrt((x - j) ** 2 + (y - i) ** 2);
            if (distance <= radius) {
                world.matrix[i][j] = new Cell(env);
            }
        }
    }
}
