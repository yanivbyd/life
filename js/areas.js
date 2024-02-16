
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

function createCanvasCtx(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    let ctx = canvas.getContext('2d');
    // document.body.appendChild(canvas); # keep this for debugging
    return ctx;
}
function canvasHasColor(canvasCtx, x, y) {
    return canvasCtx.getImageData(x, y, 1, 1).data[3] == 255;
}

function areaRoundedRectangle(world, env, x, y, width, height, cornerRadius) {
    const ctx = createCanvasCtx(width, height);
    ctx.beginPath();
    ctx.moveTo(cornerRadius, 0);
    ctx.arcTo(width, 0, width, height, cornerRadius);
    ctx.arcTo(width, height, 0, height, cornerRadius);
    ctx.arcTo(x, height, 0, 0, cornerRadius);
    ctx.arcTo(x, 0, width, 0, cornerRadius);
    ctx.closePath();
    ctx.fillStyle = 'black';
    ctx.fill();

    for (let i=y; i<= toValidIndex(world, y+height); i++) {
        for (let j=x; j<=toValidIndex(world, x+width); j++) {
            if (canvasHasColor(ctx, j-x, i-y)) {
                world.matrix[i][j] = new Cell(env);
            }
        }
    }
}
