class Point {
    constructor(x, y, d, mass) {
      this.x = x;
      this.y = y;
      this.d = d;
      this.mass = mass;
      this.acceleration = [0, 0];
      this.velocity = [0, 0];
      this.g_force = 0;
      this.loss = 0.0001;
      this.width = 0;
      this.height = 0;
      this.stopped_x = false;
      this.stopped_y = false;
      this.x_loss_factor = 4;
      this.y_loss_factor = 4;
      this.destruction = false;
      
    }
  
    set_borders(width, height) {
      this.width = width - 1;
      this.height = height - 1;
    }

    set_resistance_config(l, x_f, y_f){
        this.loss = l;
        this.x_loss_factor = x_f;
        this.y_loss_factor = y_f;
    }
  
    set_velocity(x_vel, y_vel) {
      this.velocity = [x_vel, y_vel];
    }
  
    set_destruction(destr){
      this.destruction = destr; 
    }
    
    get_coordinates() {
      return [this.x, this.y, this.d];
    }
  
    set_gravity(g) {
      this.g_force = -(g * this.mass);
    }
  
    update_gravity() {
      this.g_force = -(this.g * this.mass) / this.y;
    }
  
    assign_acceleration(acceleration) {
      this.acceleration[0] = acceleration[0] / this.mass;
      this.acceleration[1] = acceleration[1] / this.mass;
    }
  
    accelerate() {
      if (!this.stopped_x) {
        this.velocity[0] += this.acceleration[0];
      }
      if (!this.stopped_y) {
        this.velocity[1] += this.acceleration[1] + this.g_force;
      }
    }
  
    check_if_stopped() {
      if (this.velocity[1] < 2 && this.y <= this.d / 2) {
        this.y = this.d / 2;
        this.stopped_y = true;
      }
      if (this.width && this.velocity[0] <= 0.001) {
        if (this.x << (this.d / 2) && this.velocity[0] > 1) {
          this.x = this.d / 2;
          this.stopped_x = true;
        }
        if (this.x >= (this.width - (this.d / 2)) && this.velocity[0] > -1) {
          this.x = this.width - (this.d / 2);
          this.stopped_x = true;
        }
      }
    }
    
    decrease(){
      if (this.destruction === true) {
        if (this.d > 4){
          this.d -= 0.1;
        } else {
          this.d = 4;
        }
        if (this.m > 1){
          this.m -= 0.001;
        } else {
          this.m = 1;
        }
      }
    }
  
    bounce() {
      if (this.height && !this.stopped_y) {
        if (this.y <= (this.d / 2)) {
          this.velocity[1] *= -1;
          this.decrease();
        }
        if (this.y >= (this.height-40)) {
          this.velocity[1] *= -1;
          this.decrease();
        }
      }
      if (this.width && !this.stopped_x) {
        if (this.x <= (this.d / 2 + this.loss)) {
          this.velocity[0] *= -1;
          this.decrease();
        }
        if (this.x >= (this.width - (this.d / 2) - this.loss)) {
          this.velocity[0] *= -1;
          this.decrease();
        }
      }
    }
  
    losses() {
      if (this.velocity[0] > this.loss) {
        this.velocity[0] -= this.loss*this.x_loss_factor;
      } else if (this.velocity[0] < -this.loss) {
        this.velocity[0] += this.loss*this.x_loss_factor;
      } else {
        this.velocity[0] = 0;
      }
  
      if (this.velocity[1] > this.loss) {
        this.velocity[1] -= this.loss * this.y_loss_factor;
      } else if (this.velocity[1] < -this.loss) {
        this.velocity[1] += this.loss * this.y_loss_factor;
      } else {
        this.velocity[1] = 0;
      }
    }
  
    move() {
      this.accelerate();
      this.bounce();
      this.losses();
      // this.check_if_stopped();
      if (!this.stopped_x) {
        this.x += (this.velocity[0]);
      }
      if (!this.stopped_y) {
        this.y += (this.velocity[1]);
      }
      this.loss += 0.00002;
      this.decrease();
  
  
  
    }
  
  }




//CONFIGURATION DATA
let init_mass_range = [10,100];
let points_num = 10;
let gravity = 0;
let width = 1200;
let height = 800;
let x_velocity_range = [10, 10];
let y_velocity_range = [10, 10];
let air_resistance = 0.0001;
let x_resist_factor = 4;
let y_resist_factor = 4;
let clear_background = false;
let destruction = true;
//------------------------------
  



  function new_point(){
      p = new Point(random(50, width-50), random(50, height-50), random(20, 60), random(init_mass_range[0],init_mass_range[1]));
      p.set_gravity(gravity);
      p.set_resistance_config(air_resistance, x_resist_factor, y_resist_factor);
      p.set_destruction(destruction);
      p.set_borders(width, height);
      p.set_velocity(random(x_velocity_range[0], x_velocity_range[1]), random(y_velocity_range[0], y_velocity_range[1]));
      return p;
  }
  
  var points = [];
  
  function setup() {
    background(255);
    createCanvas(width, height);
    for (let i = 1 ; i <= points_num ; i++){
      points[i-1] = new_point();
    }
  }
  
  let off = 0;
  function draw() {
    if (clear_background){
        background(255);
    }
    off += 0.2;
    for (let i = 0 ; i < points_num ; i++){
      let coor = points[i].get_coordinates();
      let acc_x = map(mouseX, 0, width, -20, 20);
      let acc_y = map(mouseY, 0, height, -20, 20);
      points[i].assign_acceleration([acc_x, acc_y]);
      circle(coor[0], coor[1], coor[2]);
      let n1 = map(mouseX, 0, width, 0, 255);
      let n2 = map(mouseY, 0, height, 0, 255);
      let n3 = map(noise(off, 10), 0, 1, 30, 100);
      let n4 = map(noise(off*i), 0, 1, 100, 200);
      fill(n1, n3, n2, n4);
      points[i].move();
    }
    
  
  }