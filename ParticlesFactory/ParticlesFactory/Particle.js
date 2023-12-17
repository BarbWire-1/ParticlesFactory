
export class Particle {
	constructor(canvas, x, y, size, speed, fillStyle) {
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
		this.x = x;
		this.y = y;
		this.size = size;
		this.speed = speed;
		this.fillStyle = fillStyle;

		this.updateSpeed(speed);
	}

    drawParticle(fillColor, opacity, size, shape, strokeStyle) {
        const ctx = this.context;
		strokeStyle && (ctx.strokeStyle = strokeStyle); // set strokeStyle if stroke
		ctx.fillStyle = fillColor; //|| this.fillStyle;
		ctx.globalAlpha = opacity;

		switch (shape) {
			case 'circle':
				this.drawCircle(size);
				break;
			case 'square':
				this.drawPolygon(size, 4, -Math.PI / 4, 1, 'square');
				break;
			case 'rhombus':
				this.drawPolygon(size, 4, 0, 2 / 3, 'rhombus');
				break;
			case 'hexagon':
				this.drawPolygon( size, 6, 0, 1, 'hexagon');
				break;
			case 'triangle':
				this.drawPolygon(size, 3, -Math.PI / 2, 1, 'triangle');
				break;
			default:
				break;
		}

		if (strokeStyle) {
			ctx.strokeStyle = strokeStyle;
			ctx.stroke();
		}
	}

    drawCircle(size) {
        const ctx = this.context;
		ctx.beginPath();
		ctx.arc(this.x, this.y, size / 2, 0, Math.PI * 2);
		ctx.fill();
	}

    drawPolygon(size, sides, rotate, squeeze) {
        const ctx = this.ctx;
		const angle = (Math.PI * 2) / sides;
		const radius = size / 2;

		ctx.beginPath();
		ctx.moveTo(
			this.x + radius * Math.cos(rotate),
			this.y + radius * Math.sin(rotate * squeeze)
		);

		for (let i = 1; i <= sides; i++) {
			ctx.lineTo(
				this.x + radius * Math.cos(angle * i + rotate),
				this.y + radius * Math.sin(angle * i + rotate) * squeeze
			);
		}

		ctx.closePath();
		ctx.fill();
	}

	// flag - particle drawn or not
	keepInBoundaries(drawParticles = true) {
		let { x, y, size } = this;
		const { width, height } = this.context;

		// adjust to correct prev translating of particles to center when drawn or to 0 if not
		drawParticles ? (size /= 2) : (size = 0);
		if (x <= size || x >= width - size) {
			x = x <= size ? size : width - size;
			this.xSpeed *= -1;
		}

		if (y <= size || y >= height - size) {
			this.y = y <= size ? size : height - size;
			this.ySpeed *= -1;
		}
	}

	//TODO calc sharing cinetic "energy" ?
	particlesCollision(
		randomSize,
		commonSize,
		particle,
		otherParticle,
		distance
	) {
		const size = randomSize
			? (particle.size + otherParticle.size) / 2
			: commonSize;

		if (Math.abs(distance) <= size) {
			[particle, otherParticle].forEach((p) => {
				for (let speed of ['xSpeed', 'ySpeed']) {
					p[speed] *= p[speed] >= 6 ? -0.01 : -1.001;
				}
			});
		}
	}

	updateCoords(drawParticles) {
		this.size = this.size;
		this.keepInBoundaries(drawParticles);
		this.x += this.xSpeed;
		this.y += this.ySpeed;
	}

	updateSpeed(speed) {
		this.xSpeed = speed * (Math.random() * 2 - 1);
		this.ySpeed = speed * (Math.random() * 2 - 1);
	}

	// Inside Particle class
	handleMouseMove(event, mouseDistance) {
		if (!+mouseDistance) return; // need number here to use as bool!!!
		const mouseX = event.clientX;
		const mouseY = event.clientY;

		//console.log(mouseDistance,'listening for mouse')
		const { x, y } = this;
		let dx = mouseX - x;
		let dy = mouseY - y;

		const distance = Math.sqrt(dx * dx + dy * dy);

		if (distance && distance < mouseDistance) {
			dx /= distance;
			dy /= distance;
			const moveAmount = 1; // set to 1 to not have this distinct circle

			//TODO check why I need to define this here - something broken elsewhere!
			this.x = Math.min(
				Math.max(x + dx * -moveAmount, this.size / 2),
				this.canvas.width - this.size / 2
			);
			this.y = y + dy * -moveAmount;
		}
	}
}
//console.timeEnd('particle')
