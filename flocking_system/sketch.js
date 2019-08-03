// import "p5";

let width = 1200;
let height = 600;
let boids_nr = 100;

const flock = [];

function setup() {
    createCanvas(width, height);
    for (let i = 0 ; i < boids_nr ; i++) {
        flock.push(new Boid());
    }
    background(200);
}

function draw() {
    background(50);
    // translate(width, height);
    // rotateX(radians(45));
    for (let i = 0 ; i < boids_nr ; i++) {
        if (i === 0){
            flock[i].set_position(mouseX, mouseY);
            flock[i].set_mass(20000, 20);
        }
        flock[i].flock(flock);
        flock[i].update();
        flock[i].show();
    }
}
