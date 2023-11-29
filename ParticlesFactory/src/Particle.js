export class Particle {
	constructor(x, y, size, speed, fillStyle) {
		this.x = x;
		this.y = y;
		this.size = size;

		this.updateSpeed(speed);
	}

	draw(ctx, fillColor) {
		ctx.fillStyle = fillColor;

		// Center the particle on point
		let cx = this.x - this.size / 2;
		let cy = this.y - this.size / 2;

		ctx.fillRect(cx, cy, this.size, this.size);
	}

	// here only boundaries
	collisionDetection() {
		let { x, y, size } = this;
		const { width, height } = canvas;
        size /= 2; // adjust to correct prev translating to center
		if (x <= size || x >= width - size) {
			this.x = x <= size ? size : width - size;
			this.xSpeed *= -1;
		}

		if (y <= size || y >= height - size) {
			this.y = y <= size ? size : height - size;
			this.ySpeed *= -1;
		}
	}
	particlesCollision(particle, otherParticle, distance) {
		//console.log(this.size)
		if (Math.abs(distance < this.size)) {
			particle.xSpeed *= -1.001;
			particle.ySpeed *= -1.001;
			otherParticle.xSpeed *= -1.001;
			otherParticle.ySpeed *= -1.001;
		}
	}

	update() {
		this.size = this.size;
		this.collisionDetection();
		this.x += this.xSpeed;
		this.y += this.ySpeed;
	}

	updateSpeed(speed) {
		// rondomize speed and direction
		this.xSpeed = speed * (Math.random() * 2 - 1);
		this.ySpeed = speed * (Math.random() * 2 - 1);
	}

	updatePosition(canvas, newWidth, newHeight) {
		const currentWidth = canvas.width;
		const currentHeight = canvas.height;

		if (newWidth !== currentWidth) {
			this.x = (this.x / currentWidth) * newWidth;
		}

		if (newHeight !== currentHeight) {
			this.y = (this.y / currentHeight) * newHeight;
		}
	}
}
