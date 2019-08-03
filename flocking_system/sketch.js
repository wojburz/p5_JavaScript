// import "p5";

let width = 1200;
let height = 600;
let boids_nr = 50;
let max_mass = 0;

const flock = [];

function setup() {
    createCanvas(width, height);
    for (let i = 0 ; i < boids_nr ; i++) {
        flock.push(new Boid());
        max_mass += flock[i].get_mass();
    }

    background(200);
}

function draw() {
    background(0);
    // translate(width, height);
    // rotateX(radians(45));
    for (let i = 0 ; i < boids_nr ; i++) {
        flock[i].set_max_mass(max_mass);
        if (i === 0){
            flock[i].set_position(mouseX, mouseY);
            flock[i].set_mass(200, 20);
        }
        flock[i].flock(flock);
        flock[i].update();
        flock[i].show();
    }
}
