class Point{
    constructor(x, y, d, mass){
        this.x = x;
        this.y = y;
        this.d = d;
        this.mass = mass;
        this.acceleration = [0, 0];
        this.velocity = [0, 0];
        this.g_force = 0;
        this.loss = 0.001;
        this.width = 0;
        this.height = 0;
        this.stopped_x = false;
        this.stopped_y = false;
    }

    set_borders(width, height){
        this.width = width-1;
        this.height = height-1;
    }

    set_velocity(x_vel, y_vel){
        this.velocity = [x_vel, y_vel];
    }

    get_coordinates(){
        return [this.x, this.y];
    }

    set_gravity(g){
        this.g_force = -(g*this.mass);
    }

    update_gravity(){
        this.g_force = -(this.g*this.mass)/this.y;
    }

    assign_acceleration(acceleration){
        this.acceleration[0] = acceleration[0]/this.mass;
        this.acceleration[1] = acceleration[1]/this.mass ;
    }

    accelerate(){
        if (!this.stopped_x){
            this.velocity[0] += this.acceleration[0]; 
        }
        if (! this.stopped_y){
            this.velocity[1] += this.acceleration[1] + this.g_force ; 
        }
    }

    check_if_stopped(){
        if (this.velocity[1] < 2 && this.y <=this.d/2){
            this.y=this.d/2;
            this.stopped_y = true;
        }
        if (this.width && this.velocity[0] <= 0.001){
            if (this.x << (this.d/2) && this.velocity[0] > 1  ){
                this.x = this.d/2;
                this.stopped_x = true;
            }
            if (this.x >= (this.width - (this.d/2)) && this.velocity[0] > -1){
                this.x = this.width - (this.d/2);
                this.stopped_x = true;
            }
        }
    }

    bounce(){
        
        if (this.height && !this.stopped_y){
            if (this.y < (this.d/2)){
                this.velocity[1] = (this.velocity[1])* -1;
            }
            if (this.y > (this.height - this.d/2)){
                this.velocity[1] *= -1;
            }
        }
        if (this.width && !this.stopped_x){
            if (this.x <= (this.d/2 + this.loss)){
                this.velocity[0] *= -1;
            }
            if (this.x >= (this.width - (this.d/2)- this.loss)){
                this.velocity[0] *= -1;
            }
        }
    }

    losses(){
        if (this.velocity[0] > this.loss){
            this.velocity[0] -= this.loss;
        } else if (this.velocity[0] < -this.loss){
            this.velocity[0] += this.loss;
        } else {
            this.velocity[0] = 0;
        }

        if (this.velocity[1] > this.loss){
            this.velocity[1] -= this.loss*50;
        } else if (this.velocity[1] < -this.loss) {
            this.velocity[1] += this.loss*50;
        } else {
            this.velocity[1] = 0;
        }
    }

    move() {
        this.accelerate();
        this.bounce();
        this.losses();
        this.check_if_stopped();
        if (!this.stopped_x){
            this.x += (this.velocity[0]);
        }
        if (!this.stopped_y){
            this.y += (this.velocity[1]);
        }
        this.loss += 0.00002;


    }

}

function setup() {
    let width = 600;
    let height = 450;
    createCanvas(width, height);
    p1 = new Point(100,200, 20, 10);
    // translate(0, -500);

    p1.set_gravity(0.1);
    p1.set_borders(width, height);
    p1.set_velocity(15, 42);
}

function draw() {
    background(40);
    let coor = p1.get_coordinates();
    circle(coor[0], coor[1], 20);
    p1.move();

}