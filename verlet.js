let CANVAS_WIDTH = 500;
let CANVAS_HEIGHT = 500;

class Dot {
  constructor(x, y, vx, vy, mass) {
    this.pos = new Vector(x, y);
    this.oldpos = new Vector(x + (vx||0), y + (vy||0)); // velocity x, y

    this.friction = 0.99;
    this.groundFriction = 0.99;

    this.gravity = new Vector(0, 1);

    this.mass = mass || 1;
    this.radius = Math.abs(this.mass);
    this.color = "black";
  }

  update() {
    let vel = Vector.sub(this.pos, this.oldpos);
    vel.mult(this.friction);

    // if the point touches the ground set groundFriction
    if (this.pos.y >= CANVAS_HEIGHT - this.radius) {
      vel.mult(this.groundFriction);
    }

    this.oldpos.setXY(this.pos.x, this.pos.y);
    this.pos.add(vel);
    this.pos.add(this.gravity);
  }
    
  constrain() {
    if (this.pos.x > CANVAS_WIDTH - this.radius) {
      this.pos.x = CANVAS_WIDTH - this.radius;
    }
    if (this.pos.x < this.radius) {
      this.pos.x = this.radius;
    }
    if (this.pos.y > CANVAS_HEIGHT - this.radius) {
      this.pos.y = CANVAS_HEIGHT - this.radius;
    }
    if (this.pos.y < this.radius) {
      this.pos.y = this.radius;
    }
  }
  
  render(ctx, i) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.fillText(i,this.pos.x+3, this.pos.y-3)
    this.constrained = false;
  }
}
 
class Stick {
  constructor(p1, p2, length) {
    this.startPoint = p1;
    this.endPoint = p2;
    this.stiffness = .5;
    this.color = 'black';
    // if the length is not given then calculate the distance based on position
    if (!length) {
      this.length = this.startPoint.pos.dist(this.endPoint.pos);
    } else {
      this.length = length;
    }

  }
  
  update() {
    // calculate the distance between two dots
    let dx = this.endPoint.pos.x - this.startPoint.pos.x;
    let dy = this.endPoint.pos.y - this.startPoint.pos.y;
    // pythagoras theorem
    let dist = Math.sqrt(dx * dx + dy * dy);
    // calculate the resting distance betwen the dots
    let diff = (this.length - dist) / dist * this.stiffness;

    // getting the offset of the dots
    let offsetx = dx * diff * 0.5;
    let offsety = dy * diff * 0.5;

    // calculate mass
    let totalm = this.startPoint.mass + this.endPoint.mass;
    let m2 = this.startPoint.mass / totalm;
    let m1 = this.endPoint.mass / totalm;

    // and finally apply the offset with calculated mass
    if (!this.startPoint.pinned) {
      this.startPoint.pos.x -= offsetx * m1;
      this.startPoint.pos.y -= offsety * m1;
    }
    if (!this.endPoint.pinned) {
      this.endPoint.pos.x += offsetx * m2;
      this.endPoint.pos.y += offsety * m2;
    }

  }
  
  render(ctx) {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.moveTo(this.startPoint.pos.x, this.startPoint.pos.y);
    ctx.lineTo(this.endPoint.pos.x, this.endPoint.pos.y);
    ctx.stroke();
    ctx.closePath();
  }
}

class Entity {
  constructor(iterations) {
    this.dots = [];
    this.sticks = [];
    this.iterations = iterations || 16;
  }

  addDot(x, y, vx, vy, weight) {
    this.dots.push(new Dot(x, y, vx, vy, weight));
  }

  addStick(p1, p2, length) {
    this.sticks.push(new Stick(this.dots[p1], this.dots[p2], length));
  }

  connectDots(points) {
    for(let i = 0 ; i < points.length-1 ; i++) {
      for(let j = i+1; j < points.length ; j++) {
        this.addStick(points[i],points[j])
      }
    }
  }

  addEntity(entity) {
    this.dots = this.dots.concat(entity.dots)
    this.sticks = this.sticks.concat(entity.sticks)
  }

  updatePoints() {
    for (let i = 0; i < this.dots.length; i++) {
      this.dots[i].update();
    }
  }

  updateSticks() {
    for (let i = 0; i < this.sticks.length; i++) {
      this.sticks[i].update();
    }
  }

  updateContrains() {
    for (let i = 0; i < this.dots.length; i++) {
      this.dots[i].constrain();
    }
  }

  renderPoints(ctx) {
    for (let i = 0; i < this.dots.length; i++) {
      this.dots[i].render(ctx,i);
    }
  }
  renderSticks(ctx) {
    for (let i = 0; i < this.sticks.length; i++) {
      this.sticks[i].render(ctx);
    }
  }

  update(ctx) {
    this.updatePoints();
    for (let j = 0; j < this.iterations; j++) {
      this.updateSticks();
      this.updateContrains();
    }
    this.renderPoints(ctx);
    this.renderSticks(ctx);
  }
}

function Triangle(x1,y1,x2,y2,x3,y3) {
  let item = new Entity();
  item.addDot(x1,y1); 
  item.addDot(x2,y2); 
  item.addDot(x3,y3); 
  item.connectDots([0,1,2])
  return item
}

function Box(x,y,w,h,m) {
  let item = new Entity();
  item.addDot(x+w/2, y-h/2, 0, 0, m); 
  item.addDot(x+w/2, y+h/2, 0, 0, m); 
  item.addDot(x-w/2, y+h/2, 0, 0, m); 
  item.addDot(x-w/2, y-h/2, 0, 0, m); 

  item.connectDots([0,1,2,3])
  return item
}

function Doll(x,y,w,h) {
  let item = new Entity();

  item.addEntity( Box(x,y,w*4,h*8, 3) )

  item.addEntity(Triangle(x,y-h*9, x+w*4,y-h*7, x-w*2,y-h*7))
  item.addStick(0,4)
  item.addStick(3,4)
  item.addStick(6,3)

  item.addDot(x+w*1.5,y+h*11)


  return item

}