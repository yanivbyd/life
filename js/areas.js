
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
    ctx.clearRect(0, 0, world.size, world.size);
}

function initRandomAreas(world) {
    const size = world.size;
    const ctx = createCanvasCtx(size, size);

    var numberOfRandomShapes = randomInt(5, 8);
    for (let counter=0; counter<numberOfRandomShapes; counter++) {
        var numLines = randomInt(30, 80);

        ctx.beginPath();
        var point = [randomInt(0, size), randomInt(0, size)];
        ctx.moveTo(point[0], point[1]);

        for (var i = 0; i < numLines; i++) {
            var newPoint = [point[0] + randomInt(0, size-50), randomInt(0, size-50)];
            ctx.bezierCurveTo(point[0], point[1], newPoint[0], newPoint[1], randomInt(0, size), randomInt(0, size));
            point = newPoint;
        }
        finalizeCanvas(world, ctx);
    }

    var numberOfEllipses = randomInt(5, 8);
    for (let counter=0; counter < numberOfEllipses.length; counter++) {
        ctx.ellipse(randomInt(0, size-80), randomInt(0, size-80),
            randomInt(10, 30), randomInt(10, 30),
            randomInt(5, 10), randomInt(0 ,90), 1);
        finalizeCanvas(world, ctx);
    }

}