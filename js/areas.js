
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
    const numberOfShapes = 3;

    for (var s=0;s<numberOfShapes;s++) {
        for (var i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(randomInt(5, size - 5), randomInt(5, size - 5));

            for (var i = 0; i < 10; i++) {
                ctx.quadraticCurveTo(randomInt(0, size), randomInt(0, size), randomInt(0, size), randomInt(0, size));
            }
        }
        finalizeCanvas(world, ctx);
    }

}