
function toValidIndex(world, index) {
    if (index < 0) return 0;
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
    for (let i = toValidIndex(world, y-radius); i <= toValidIndex(world, y+radius); i++) {
        for (let j = toValidIndex(world, x-radius); j <= toValidIndex(world, x+radius); j++) {
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
    // document.body.appendChild(canvas); /* keep this for debugging */
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

function areaPolygon(world, env, points, arcRadius, dx, dy) {
    const ctx = createCanvasCtx(world.size, world.size);
    ctx.beginPath();

    ctx.moveTo(dx+points[0].x, dy+points[0].y);
    for(let i=1; i<points.length; i++) {
        if (arcRadius) {
            ctx.arcTo(dx+points[i-1].x, dy+points[i-1].y, dx+points[i].x, dy+points[i].y, arcRadius);
        } else {
            ctx.lineTo(dx+points[i].x, dy+points[i].y);
        }
    }
    if (arcRadius) {
        ctx.arcTo(dx+points[points.length-1].x, dy+points[points.length-1].y, dx+points[0].x, dy+points[0].y, arcRadius);
    }
    ctx.closePath();
    ctx.fillStyle = 'black';
    ctx.fill();

    for (let i=0; i<=world.size; i++) {
        for (let j=0; j<=world.size; j++) {
            if (canvasHasColor(ctx, j, i)) {
                world.matrix[i][j] = new Cell(env);
            }
        }
    }
}
