
function areaRectangle(matrix, matrixSize, env, x, y, width, height) {
    for (var i=y; i<=Math.min(y+height, matrixSize-1); i++) {
        for (var j=x; j<=Math.min(x+width, matrixSize-1); j++) {
            matrix[i][j] = new Cell(env);
        }
    }
}