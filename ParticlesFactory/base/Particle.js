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

	// here only boundaries
	// flag - particle drawn or not
	keepInBoundaries(drawParticles) {
		const { x, y, size } = this;
		const { width, height } = this.canvas;

		// as particle translated to center here need to get offset size/2 IF particle is drawn
		const adjustSize = drawParticles ? size / 2 : 0;

		// boundaries
		const left = x <= adjustSize;
		const right = x >= width - adjustSize;
		const top = y <= adjustSize;
		const bottom = y >= height - adjustSize;

		if (left || right) {
			this.x = left ? adjustSize : width - adjustSize;
			this.xSpeed *= -1;
		}

		if (top || bottom) {
			this.y = top ? adjustSize : height - adjustSize;
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

	updatePosition(newWidth, newHeight) {
		const currentWidth = this.canvas.width;
		const currentHeight = this.canvas.height;

		if (newWidth !== currentWidth) {
			this.x = (this.x / currentWidth) * newWidth;
		}

		if (newHeight !== currentHeight) {
			this.y = (this.y / currentHeight) * newHeight;
		}
	}

	// helpers
	#getVector(x1, y1, x2, y2) {
		return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
	}

	handleMouseMove(mouseX, mouseY, mouseDistance) {
		//if (!mouseX || !mouseDistance) return;
		const { x, y } = this;
		let distance = this.#getVector(x, y, mouseX, mouseY);

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
