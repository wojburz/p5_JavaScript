class Boid {
    constructor(max_mass=800){
        this.position = createVector(random(30, width-30), random(30, height-30));
        this.velocity = p5.Vector.random2D();
        // velocity = p5.Vector.random2D();
        this.velocity.setMag(random(10));
        this.acceleration = createVector();
        this.mass = random(max_mass/20, max_mass);
        this.r = this.recalculate_radius();
        this.g = 40;
        this.g_strenght;
        this.g_total = 0;
        this.near_obj = 0;
        this.near_mass = 0;
        this.alligned_mass = 0;
        this.max_mass = 0;
        this.red_fact = 0.9999;
        this.stroke = 255;
        this.is_black_hole = false;
        this.is_primal = false;
        this.absorbtion = 0;
    }

    get_mass() {
        return this.mass;
    }

    set_max_mass(m) {
        this.max_mass = m;
    }

    recalculate_radius(bh_div=0.2, natural_div=0.8, bh_dens=1000, nat_dens=50) {
        let new_r;
        if (this.is_black_hole) {
            new_r = 0.01*(this.mass**bh_div)/(bh_dens*bh_dens*bh_dens);
        } else {
            new_r = (this.mass**natural_div)/nat_dens;
        }
        return new_r;
    }

    reduce_velocity(reduction_factor=0.999){
        this.velocity.mult(reduction_factor);
        this.acceleration.mult(reduction_factor);
    }

    set_position(x, y){
        this.position.x = x;
        this.position.y = y;
    }

    add_mass(m) {
        this.mass += m;
        this.r = this.recalculate_radius();
    }

    set_mass(m, r=this.r) {
        this.mass = m;
        this.r = this.recalculate_radius();
    }

    glow(power = 1, boids = false){
        let glow_radius = this.r*2*this.near_obj*power;
        if (this.is_black_hole){
            glow_radius = this.r*power*this.mass/200;
        }
        let glow_str = map(this.near_mass, this.max_mass/100, this.max_mass*2, 0, 255);
        // glow_str += power;
        let r =map(noise(glow_radius/10), 0, 1, 100, 255);
        let g = map(noise(glow_radius/300), 0, 1, 100, 255);
        let b = map(noise(glow_radius/100), 0, 1, 100, 255);
        // this.stroke = glow_str;
        fill(r , g, b, glow_str/(0.15*glow_str));
        noStroke();
        circle(this.position.x, this.position.y, glow_radius/2);
        if (this.alligned_mass > this.mass*20){
          this.stroke = 0;
          if ((this.alligned_mass > this.g * this.mass) && !this.is_black_hole){
            // this.red_fact = 0;
            this.is_black_hole = true;
            this.is_primal = true;
            if (boids) {
                this.absorbtion = 100;
                this.switch_gravity(boids, -40*100*this.near_mass);
            }
            // this.g = -100;
            this.r = this.recalculate_radius();
          }
        } else {
          this.stroke = 255-glow_str*2;
        }
        // if (this.alligned_mass < this.mass*4)

        
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

    switch_gravity(boids, new_g) {
        for (let boid of boids) {
            boid.g = new_g;
        }
    }

    flock(boids) {
        let result = this.allign(boids)
        let allignment = result[0];
        let gravity = result[1];

        allignment.div(this.mass);
        gravity.div(this.mass);

        gravity.add(allignment);
        
        if (this.is_black_hole) {
            if (this.absorbtion > 0){
                // if (this.absorbtion === 100) {
                    // gravity.mult(-1);
                    // this.switch_gravity(boids, -40);
                // } else 
                if (this.absorbtion === 10) {
                    // gravity.mult(-1);
                    this.switch_gravity(boids, 40);
                }
                this.glow(this.absorbtion/10, boids);
            } else {
            }
            this.stroke = 0;
            this.acceleration.mult(1);
        } else { 
            this.glow(this.mass/1000);
        }
        this.acceleration = gravity;
        
        
    }

    allign(boids) {
        let gravity_perception = 100000;
        let flocking_preception = 10;
        // let near_obj_dst = this.r*this.velocity.mag();
        let near_obj_dst = this.r*this.velocity.mag()*this.acceleration.mag();

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
            if (d < other.r*2) {
               this.alligned_mass += other.mass;
               if (other != this && other.is_black_hole && !this.is_black_hole){
                    other.absorbtion += 20;
                    this.set_position(other.position.x, other.position.y);
                    other.add_mass(this.mass);
                    this.set_mass(other.get_mass());
                // this.red_fact = 0;
                    this.is_black_hole = true;
                    this.r = this.recalculate_radius();
                    this.absorbtion = 100;

                }
            }
            if (other != this && d < near_obj_dst) {
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

    check_if_outside(width, height) {
        if (this.position.x > width) {
            this.position.x = 0;
        }
        if (this.position.x < 0) {
            this.position.x = width;
        }
        if (this.position.y > height) {
            this.position.y = 0;
        }
        if (this.position.y < 0) {
            this.position.y = height;
        }
    }

    update() {
        this.absorbtion -= 1;
        if (!this.is_black_hole){
            this.position.add(this.velocity);
            this.velocity.add(this.acceleration);
            this.reduce_velocity(this.red_fact);
            if (this.red_fact > 0.1){
                this.red_fact -= 0.0001;
            }
        } else {
            this.stroke = 0;
            this.r = this.mass/1000;
        }
        
    }

    show() {
        strokeWeight(this.r*2);
        stroke(this.stroke);
        point(this.position.x, this.position.y);
    }
}

class Star {
    constructor(width, height, off) {
        if (random(100) > 70){
            this.x = map(noise(off/random(0,1)), 0, 1, 0, width);
            this.y = map(noise((off/random(0,1))), 0, 1, height/2-200, height/2+200);
        } else {
            this.x = random(width);
            this.y = random(height);
        }
    }

    show() {
        if (random(100) > 90){
            strokeWeight(map(noise(this.x*this.y/1000), 0, 1, 1, 3));
            stroke(random(100,150));
        } else {
            strokeWeight(1);
            stroke(100);
        }
        point(this.x, this.y);
    }

}
