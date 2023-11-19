export class Particle {
  constructor(x, y, size, speed) {
    this.x = x;
    this.y = y;
    this.size = size;
    // rondomize speed and direction
    this.xSpeed = speed * (Math.random() * 2 - 1);
    this.ySpeed = speed * (Math.random() * 2 - 1);
  }

  draw(ctx, fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }

  collisionDetection() {
    const { x, y, size } = this;
    const { width, height } = canvas;

    if (x <= size || x >= width - size) {
      this.x = x <= size ? size : width - size;
      this.xSpeed *= -1;
    }

    if (y <= size || y >= height - size) {
      this.y = y <= size ? size : height - size;
      this.ySpeed *= -1;
    }
  }

  update() {
    this.collisionDetection();
    this.x += this.xSpeed;
    this.y += this.ySpeed;

  }
}
