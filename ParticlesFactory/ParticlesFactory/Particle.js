// gets the canvas passed in calling methods from the consuming class

export class Particle {
	constructor(canvas, x, y, size, speed) {
		this.canvas = canvas;
		this.x = x;
		this.y = y;
		this.size = size;
		this.speed = speed;

		this.updateSpeed(speed);
	}

	draw(ctx, fillColor, opacity) {
		ctx.fillStyle = fillColor;
		ctx.globalAlpha = opacity;

		// Center the particle on point
		let cx = this.x - this.size / 2;
		let cy = this.y - this.size / 2;

		ctx.fillRect(cx, cy, this.size, this.size);
	}

	// flag - particle drawn or not
	keepInBoundaries(drawParticles) {
		let { x, y, size } = this;
		const { width, height } = this.canvas;
		// adjust to correct prev translating of particles to center when drawn or to 0 if not
		drawParticles ? (size /= 2) : (size = 0);
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
		if (Math.abs(distance) < this.size) {
			[particle, otherParticle].forEach((p) => {
				p.xSpeed *= -1.001;
				p.ySpeed *= -1.001;
			});
		}
	}

	update(drawParticles) {
		this.size = this.size;
		this.keepInBoundaries(drawParticles);
		this.x += this.xSpeed;
		this.y += this.ySpeed;
	}

	updateSpeed(speed) {
		// rondomize speed and direction
		this.xSpeed = speed * (Math.random() * 2 - 1);
		this.ySpeed = speed * (Math.random() * 2 - 1);
	}

	// helpers
	#getVector(x1, y1, x2, y2) {
		return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
	}

	// Inside Particle class
	handleMouseMove(event, mouseDistance) {
		const mouseX = event.clientX;
		const mouseY = event.clientY;

		if (!mouseX || !mouseDistance) return;

		const { x, y } = this;
		const distance = this.#getVector(x, y, mouseX, mouseY);

		if (distance && distance < mouseDistance) {
			let dx = mouseX - x;
			let dy = mouseY - y;
			const length = Math.sqrt(dx * dx + dy * dy);
			dx /= length;
			dy /= length;

			const moveAmount = 5;
			this.x = x + dx * -moveAmount;
			this.y = y + dy * -moveAmount;
		}
	}
}
