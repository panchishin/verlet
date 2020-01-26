class Vector {

  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  static dist(v1, v2) {
    return v1.dist(v2);
  }

  static distSq(v1, v2) {
    return v1.distSq(v2);
  }

  static sub(v1, v2) {
    return new Vector(v1.x - v2.x, v1.y - v2.y);
  }

  static add(v1, v2) {
    return new Vector(v1.x + v2.x, v1.y + v2.y);
  }

  add(x, y) {
    if (arguments.length === 1) {
      this.x += x.x;
      this.y += x.y;
    } else if (arguments.length === 2) {
      this.x += x;
      this.y += y;
    }
    return this;
  }

  sub(x, y) {
    if (arguments.length === 1) {
      this.x -= x.x;
      this.y -= x.y;
    } else if (arguments.length === 2) {
      this.x -= x;
      this.y -= y;
    }
    return this;
  }

  mult(v) {
    if (typeof v === 'number') {
      this.x *= v;
      this.y *= v;
    } else {
      this.x *= v.x;
      this.y *= v.y;
    }
    return this;
  }

  div(v) {
    if (typeof v === 'number') {
      this.x /= v;
      this.y /= v;
    } else {
      this.x /= v.x;
      this.y /= v.y;
    }
    return this;
  }

  /**
   * set this vectors angle
   */
  setAngle(angle) {
    var len = this.mag();
    this.x = Math.cos(angle) * len;
    this.y = Math.sin(angle) * len;
  }

  angle(v) {
    return Math.atan2(this.x ,this.y);
  }

  rotateBy(origin, theta) {
    var x = this.x - origin.x;
    var y = this.y - origin.y;
    return new Vector(
      x * Math.cos(theta) - y * Math.sin(theta) + origin.x,
      x * Math.sin(theta) + y * Math.cos(theta) + origin.y
    );
  }


  magSq() {
    return (this.x * this.x + this.y * this.y);
  }

  mag() {
    return Math.sqrt(this.magSq());
  }


  setXY(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  setMag(value) {
    this.normalize();
    this.mult(value);
    return this;
  }

  normalize() {
    let m = this.mag();
    if (m > 0) {
      this.div(m);
    }
    return this;
  }

  heading() {
    return (-Math.atan2(-this.y, this.x));
  }

  dist(v) {
    let dx = this.x - v.x;
    let dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  distSq(v) {
    let dx = this.x - v.x;
    let dy = this.y - v.y;
    return (dx * dx + dy * dy);
  }

  copy() {
    return new Vector(this.x, this.y);
  }

  negative() {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }

  project(v) {
    var coeff = ((this.x * v.x) + (this.y * v.y)) / ((v.x * v.x) + (v.y * v.y));
    this.x = coeff * v.x;
    this.y = coeff * v.y;
    return this;
  }

  rotate(a) {
    var b = this.heading() + a;
    var c = this.mag();
    this.x = Math.cos(b) * c;
    this.y = Math.sin(b) * c;
  }
}