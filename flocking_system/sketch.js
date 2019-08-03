let width = 1400;
let height = 700;
let boids_nr = 5;
let max_mass = 0;

const flock = [];

function setup() {
    createCanvas(width, height);
    for (let i = 0 ; i < boids_nr ; i++) {
        flock.push(new Boid());
        max_mass += flock[i].get_mass();
    }

    background(0);
}

function draw() {
    background(0);
    // translate(width, height);
    // rotateX(radians(45));
    for (let i = 0 ; i < boids_nr ; i++) {
        flock[i].set_max_mass(max_mass);
        if (i === 0){
            flock[i].set_position(mouseX, mouseY);
            flock[i].set_mass(100, 5);
        }
        flock[i].flock(flock);
        flock[i].update();
        flock[i].show();
    }
}

var boid, curr_mass;
var locked = true;
function mousePressed() {
  if (locked === true) {
    locked = false;
    boid = new Boid();
    boid.set_position(mouseX, mouseY);
  } else {
    curr_mass = boid.get_mass();
    curr_mass+= 100;
    boid.set_mass(curr_mass);
  }
}

function mouseDragged() {
  if (!locked) {
    curr_mass += mouseY;
  }
}

function mouseReleased() {
  max_mass += boid.get_mass();
  flock.push(boid);
  locked = true;
  boids_nr++;
}