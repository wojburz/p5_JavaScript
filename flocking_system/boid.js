class Boid {
    constructor(){
        this.position = createVector(random(30, width-30), random(30, height-30));
        this.velocity = createVector();
        // velocity = p5.Vector.random2D();
        this.velocity.setMag(random(2));
        this.acceleration = createVector();
        this.mass = random(200, 800);
        this.r = this.mass/80
        this.g = 40;
        this.g_strenght;
        this.g_total = 0;
        this.near_obj = 0;
        this.near_mass = 0;
        this.alligned_mass = 0;
        this.max_mass = 0;
        this.red_fact = 0.9999;
        this.stroke = 255;
    }

    get_mass() {
        return this.mass;
    }

    set_max_mass(m) {
        this.max_mass = m;
    }

    reduce_velocity(reduction_factor=0.999){
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

    glow(){
        let glow_str = map(this.near_mass, this.max_mass/100, this.max_mass*2, 0, 255);
        let r =random(100, glow_str);
        let g = random(100,glow_str/4);
        let b = random(100, glow_str/4);
        // this.stroke = glow_str;
        fill(r , g, b, glow_str);
        noStroke();
        circle(this.position.x, this.position.y, this.r*2*this.near_obj);
        if (this.alligned_mass > this.mass*8){
          this.stroke = 0;
        } else if (this.alligned_mass < this.mass*4){
          this.stroke = 255-glow_str*2;
        }
        

        
    }

    get_gravity(other){
        let gravity_force = p5.Vector.sub(other.position, this.position);
        let distance = gravity_force.mag();
        // distance = constrain(distance, 5, 25);
        gravity_force.normalize();
        this.g_strength = (this.g * this.mass * other.mass) / (distance * distance);
        gravity_force.mult(this.g_strength);

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

        this.glow();

        this.acceleration = gravity;
    }

    allign(boids) {
        let gravity_perception = 100000;
        let flocking_preception = 10;
        let near_obj_dst = this.r*this.velocity.mag();
        let f_total = 0;

        this.g_total = 0;
        this.near_obj = 0;
        this.near_mass = 0;
        this.alligned_mass = this.mass;

        let gravity = createVector();
        let steering = createVector();
        for (let other of boids) {
            let d = dist(
                this.position.x, 
                this.position.y, 
                other.position.x, 
                other.position.y);
            if (d < this.r*3) {
               this.alligned_mass += other.mass;
            }
            if (d < near_obj_dst) {
                this.near_obj++;
                this.near_mass += other.mass;
            }
            if (other != this && d < gravity_perception){
                gravity.add(this.get_gravity(other));
                this.g_total++;
                if (d < flocking_preception){
                    steering.add(other.velocity);
                    f_total++;
                }
            }
        }


        if (this.g_total > 0) {
            gravity.div(this.g_total);
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
        this.reduce_velocity(this.red_fact);
      this.red_fact -= 0.0001;
    }

    show() {
        strokeWeight(this.r*2);
        stroke(this.stroke);
        point(this.position.x, this.position.y);
    }
}
