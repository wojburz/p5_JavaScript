let coor = [0, 0, 100, 100];
let hit_coor = [0, 0];
let rad = 0;
let multiplier = [1, 1, 1, 1];
let hit;
let diameter = 40;
let radius = 0;
let speed = 1;


function setup() {
    createCanvas(700, 500);
}


function onHit(coor, radius) {
    if (radius > 0) {
        circle(coor[0], coor[1], 150 - radius);
    }
}

function draw() {
    hit = false;
    if (radius > 0) {
        background(radius*(radius/100));
    } else {
        background(1);
    }
    circle(coor[0], coor[1], diameter);
    fill(255,255,255,255);

    for (let i = 0; i < 4; i++) {
        if (coor[i] <= 0+diameter/2) {
            multiplier[i] = 1;
            hit = true;
        }
        if (i == 0 && coor[i] >= (700 - diameter*1.5)) {
            multiplier[i] = -1;
            hit = true;
        }
        if (coor[i] >= (500 - diameter/2) && i == 1) {
            multiplier[i] = -1;
            hit = true;
        }



        coor[i] = coor[i] + (speed * multiplier[i]);
    }
    if (hit === true) {
        speed = 9;
        if (coor[0] < diameter || coor[1] < diameter) {
            hit_coor = [coor[0]-diameter/2, coor[1]-diameter/2];
        } else {
            hit_coor = [coor[0] + diameter/2, coor[1] + diameter/2];
        }
        radius = 150;
    }
    if (speed > 0.4) {
        speed = speed / 1.02;
    }
    fill(255,255,255,radius*2);

    onHit(hit_coor, radius);
    fill(255,255,255,255);

    radius--;



}