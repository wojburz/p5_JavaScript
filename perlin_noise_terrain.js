var cols, rows;
var scl = 20;
var w = 1400;
var h = 1000;

var flying = 0;

var terrain = [];

function setup() {
    createCanvas(600, 600, WEBGL);
    cols = w/scl;
    rows = h/scl;
    for (let x = 0 ; x < cols ; x++){
        terrain[x] = [];
        for (let y = 0 ; y < rows ; y++){
            terrain[x][y] = 0;
        }
    }
}

function draw() {
    background(20);
    translate(0, 50);
    rotateX(PI/3);
    fill(200,230,200, 60);
    translate(-w/2, -h/2);
    
    flying -= 0.08;
    var y_off = flying;
    for (let y = 0 ; y < rows ; y++){
        var x_off = 0;
        for (let x = 0 ; x < cols ; x++){
            terrain[x][y] = map(noise(x_off, y_off), 0, 1, x*-1, y*4);
            x_off += 0.2;
        }
        y_off += 0.2;
    }
    //draw
    for (let y = 0 ; y < rows-1 ; y++){
        beginShape(TRIANGLE_STRIP);
        for (let x = 0 ; x < cols ; x++){
            vertex(x*scl, y*scl, terrain[x][y]);
            vertex(x*scl, (y+1)*scl, terrain[x][y+1]);
        }
        endShape();
    }
}



