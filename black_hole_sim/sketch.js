let width = 1400;
let height = 700;
let boids_nr = 80;
let max_mass = 0;

var locked = true;
var boid, curr_mass;

var stars = []

const flock = [];

function setup() {
    createCanvas(width, height);

    for (let j = 0 ; j < 500 ; j++){
        stars.push(new Star(width,height, j));
    }
    
    for (let i = 0 ; i < boids_nr ; i++) {
        flock.push(new Boid(random(400, 1000)));
        max_mass += flock[i].get_mass();
    }

    background(0);
}

function draw() {
    background(0);

    for (let star of stars) {
        star.show();
    }

    curr_mass += 100;
    // translate(width, height);
    // rotateX(radians(45));
    for (let i = 0 ; i < boids_nr ; i++) {
        flock[i].set_max_mass(max_mass);
        if (i === 0){
            flock[i].set_position(mouseX, mouseY);
            flock[i].set_mass(1000);
        }
        flock[i].flock(flock);
        // flock[i].check_if_outside(width, height);
        flock[i].update();
        flock[i].show();
    }
}

function mousePressed() {
    curr_mass = 0;
    locked = false;
    boid = new Boid();
    flock.push(boid);
}

function mouseReleased() {
    flock[boids_nr].set_position(mouseX, mouseY);

    flock[boids_nr].set_mass(curr_mass);
    max_mass += curr_mass;
    locked = true;
    boids_nr++;
}