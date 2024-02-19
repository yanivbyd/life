
function toValidIndex(world, index) {
    if (index < 0) return 0;
    return Math.min(index, world.size-1);
}

function createCanvasCtx(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    let ctx = canvas.getContext('2d');
    // document.body.appendChild(canvas); /* keep this for debugging */
    return ctx;
}
function canvasHasColor(canvasCtx, x, y) {
    return canvasCtx.getImageData(x, y, 1, 1).data[3] == 255;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}


function finalizeCanvas(world, ctx) {
    ctx.fillStyle = 'black';
    ctx.closePath();
    ctx.fill();

    for (let i=0; i<=world.size; i++) {
        for (let j=0; j<=world.size; j++) {
            if (canvasHasColor(ctx, j, i)) {
                world.matrix[i][j].env.rain = world.matrix[i][j].env.rain+1;
            }
        }
    }
    // ctx.clearRect(0, 0, world.size, world.size);
}

function initRandomAreas(world) {
    const size = world.size;
    const ctx = createCanvasCtx(size, size);

    for (let i = 0; i < 5; i++) {
        var startX = getRandom(0, 1) * size;
        var startY = getRandom(0, 1) * size;
        ctx.moveTo(startX, startY);

        var cp1X = getRandom(0, 1) * size;
        var cp1Y = getRandom(0, 1) * size;
        var cp2X = getRandom(0, 1) * size;
        var cp2Y = getRandom(0, 1) * size;
        var endX = getRandom(0, 1) * size;
        var endY = getRandom(0, 1) * size;
        ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY);

        ctx.moveTo(startX, startY);
        ctx.lineTo(startX, getRandom(0.7, 1) * size);

        cp1X = getRandom(0, 1) * size;
        cp1Y = getRandom(0, 1) * size;
        cp2X = getRandom(0, 1) * size;
        cp2Y = getRandom(0, 1) * size;
        endX = getRandom(0, 1) * size;
        endY = getRandom(0, 1) * size;
        ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY);

        finalizeCanvas(world, ctx);
    }

}