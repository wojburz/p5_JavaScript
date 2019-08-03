
class Boid {
    constructor(){
        this.position = createVector(random(30, width-30), random(30, height-30));
        this.velocity = createVector(0, 0);
        this.velocity.setMag(random(0));
        this.acceleration = createVector();
        this.mass = random(10, 400);
        this.r = this.mass/50
        this.g = 20;
    }

    reduce_velocity(reduction_factor=0.99999){
        this.velocity.mult(reduction_factor);
        this.acceleration.mult(reduction_factor);
    }

    set_position(x, y){
        this.position.x = x;
        this.position.y = y;
    }

    set_mass(m, r=this.r) {
        this.mass = m;
        this.r = r;
    }

    get_gravity(other){
        let gravity_force = p5.Vector.sub(other.position, this.position);
        let distance = gravity_force.mag();
        // distance = constrain(distance, 5, 25);
        gravity_force.normalize();
        let strength = (this.g * this.mass * other.mass) / (distance * distance);
        gravity_force.mult(strength);

        if (distance <= (this.r + other.r)*2){
            gravity_force.normalize();
            gravity_force.mult(-0.9);
        }
        return gravity_force;
    }

    flock(boids) {
        let result = this.allign(boids)
        let allignment = result[0];
        let gravity = result[1];
        
        // let x_factor = map(mouseX, 0, width, -20, 20);
        // let y_factor = map(mouseY, 0, height, -20, 20);
        // let mouse_acc = createVector(x_factor, y_factor);
        // gravity_force.div(this.mass);
        // mouse_acc.div(this.mass);
        allignment.div(this.mass);
        gravity.div(this.mass);

        gravity.add(allignment);
        // gravity.add(mouse_acc);

        

        this.acceleration = gravity;
    }

    allign(boids) {
        let gravity_perception = 1000000;
        let flocking_preception = 10;
        let g_total = 0;
        let f_total = 0;

        let gravity = createVector();
        let steering = createVector();
        for (let other of boids) {
            let d = dist(
                this.position.x, 
                this.position.y, 
                other.position.x, 
                other.position.y);

            if (other != this && d < gravity_perception){
                gravity.add(this.get_gravity(other));
                g_total++;
                if (d < flocking_preception){
                    steering.add(other.velocity);
                    f_total++;
                }
            }
        }



        if (g_total > 0) {
            gravity.div(g_total);
            gravity.sub(this.velocity);
        }
        if (f_total > 0) {
            steering.div(f_total);
            steering.sub(this.velocity);
        }
        return [steering, gravity];
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.reduce_velocity(0.8);
    }

    show() {
        strokeWeight(this.r*2);
        stroke(255);
        point(this.position.x, this.position.y);
    }
}