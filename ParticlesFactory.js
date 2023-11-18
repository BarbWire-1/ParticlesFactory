// TODO add more optional variables??
// TODO convert into a factory function?
// TODO change to drawing imageData bulk operation? test performance diferences

export default class ParticleFactory {
  #ctx;
  #particles;

  constructor(options) {
    const {
      canvasId = "",
      numParticles = 300,
      speed = 0.5,
      strokeColor = "#fff",
      fillColor = "#000",
      connectDistance = 100,
      mouseDistance = 100,
    } = options;

    this.canvas = document.getElementById(canvasId);
    this.#ctx = this.canvas.getContext("2d");
    this.numParticles = numParticles;
    this.speed = speed;
    this.strokeColor = strokeColor;
    this.fillColor = fillColor;

    this.connectDistance = connectDistance;
    this._mouseDistance = mouseDistance;
    this.animationId = null;

    this.#particles = [];

    this.canvas.addEventListener("pointermove", e => {
      this.#handleMouseMove(e);
    });

    
    this.drawParticles();
    this.#startAnimation();
  }

  drawParticles() {
    this.#particles = [];

    for (let i = 0; i < this.numParticles; i++) {
      this.#particles.push(
        new Particle(
          Math.random() * (this.canvas.width - 4) + 2,
          Math.random() * (this.canvas.height - 4) + 2,
          2,
          this.speed
        )
      );
    }
  }
  #getDistance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }
  #handleMouseMove(event) {
    let rect = this.canvas.getBoundingClientRect();
    const { left, top, width, height } = rect;
    let mouseX = event.clientX - left;
    let mouseY = event.clientY - top;

    for (let particle of this.#particles) {
      let distance = this.#getDistance(particle.x, particle.y, mouseX, mouseY);

      if (distance < this._mouseDistance) {
        let dx = mouseX - particle.x;
        let dy = mouseY - particle.y;
        // get the vector from mouse to particle pos
        let length = Math.sqrt(dx * dx + dy * dy);
        dx /= length;
        dy /= length;

        let moveAmount = 5; // variable to multiply offset

        let proposedX = particle.x + dx * -moveAmount;
        let proposedY = particle.y + dy * -moveAmount;

        // Ensure the new positions stay within the canvas boundaries
        particle.x = Math.min(
          Math.max(proposedX, particle.size),
          width - particle.size
        );
        particle.y = Math.min(
          Math.max(proposedY, particle.size),
          height - particle.size
        );
        //console.log(particle.x, particle.y)
      }
    }
  }

  #startAnimation() {
    this.#ctx.fillStyle = this.fillColor;
    this.#ctx.lineWidth = 0.5;
    this.#ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.#particles.length; i++) {
      const particle = this.#particles[i];

      // get the particles inside the set distance and draw connection-lines
      for (let j = i + 1; j < this.#particles.length; j++) {
        const otherParticle = this.#particles[j];
        const isInRadius =
          this.#getDistance(
            particle.x,
            particle.y,
            otherParticle.x,
            otherParticle.y
          ) <= this.connectDistance;

        if (isInRadius) {
          // draw connecting line
          this.#ctx.beginPath();
          this.#ctx.moveTo(particle.x, particle.y);
          this.#ctx.lineTo(otherParticle.x, otherParticle.y);
          this.#ctx.strokeStyle = this.strokeColor;
          this.#ctx.stroke();
        }
      }

      particle.update();
      //TODO call only optional for different color??
      //particle.draw(this.#ctx, this.strokeColor);
    }

    this.animationId = requestAnimationFrame(this.#startAnimation.bind(this));
  }
  #stopAnimation() {
    cancelAnimationFrame(this.animationId);
    this.animationId = null;
    //console.log(this.animationId);
  }
  // Method to toggle animation state
  toggleAnimation() {
    if (this.animationId) {
      this.#stopAnimation();
    } else {
      this.#startAnimation();
    }
  }



}

class Particle {
  constructor(x, y, size, _speed) {
    this.x = x;
    this.y = y;
    this.size = size;
    // rondomize speed and direction
    this.xSpeed = _speed * (Math.random() * 6 - 3);
    this.ySpeed = _speed * (Math.random() * 6 - 3);
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
