export class Particle {
  constructor(x, y, size,speed) {
    this.x = x;
    this.y = y;
    this.size = size;
    // rondomize speed and direction
    this.xSpeed = speed * (Math.random() * 6 - 3);
    this.ySpeed = speed * (Math.random() * 6 - 3);
  }

  draw(ctx, fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fillRect(this.x, this.y, 10, 10);
  }

  update() {
    // return if boundaries touched
    if (this.x <= this.size || this.x >= canvas.width - this.size) {
      this.xSpeed *= -1;
    }
    if (this.y <= this.size || this.y >= canvas.height - this.size) {
      this.ySpeed *= -1;
    }
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }
}