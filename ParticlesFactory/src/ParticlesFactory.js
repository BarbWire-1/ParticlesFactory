// TODO add more optional variables??
// TODO convert into a factory function?
// TODO change to drawing imageData bulk operation? test performance diferences
//TODO1 check collision detection boundaries and particles update...
import { Particle } from './Particle.js';
export class ParticlesFactory {
	#ctx;
	#particles;
	#animationId;

	constructor(options) {
		const {
			canvasId = '',
			numParticles = 300,
			speed = 0.5,
			strokeColor = '#fff',
			bgColor = '#000',
			connectDistance = 100,
			mouseDistance = 100,
		} = options;

		this.canvas = document.getElementById(canvasId);
		this.#ctx = this.canvas.getContext('2d');
		this.numParticles = numParticles;
		this.speed = speed;
		this.strokeColor = strokeColor;
		this.bgColor = bgColor;

		this.connectDistance = connectDistance;
		this.mouseDistance = mouseDistance;
		this.#animationId = null;

		this.#particles = [];

		this.canvas.addEventListener('pointermove', (e) => {
			this.#handleMouseMove(e);
		});

		this.createParticles();
		this.#startAnimation();
	}

	createParticles() {
		this.#particles = [];

		for (let i = 0; i < this.numParticles; i++) {
			const { width, height } = this.canvas;
			const size = 2; // expose this?
			this.#particles.push(
				new Particle(
					Math.random() * (width - 2 * size) + size,
					Math.random() * (height - 2 * size) + size,
					size,
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
		const { left, top } = rect;
		let mouseX = event.clientX - left;
		let mouseY = event.clientY - top;

		for (let particle of this.#particles) {
			const { x, y } = particle;
			let distance = this.#getDistance(x, y, mouseX, mouseY);

			if (distance < this.mouseDistance) {
				let dx = mouseX - x;
				let dy = mouseY - y;
				// get the vector from mouse to particle pos
				let length = Math.sqrt(dx * dx + dy * dy);
				dx /= length;
				dy /= length;

				let moveAmount = 5; // variable to multiply offset

				particle.x = x + dx * -moveAmount;
				particle.y = y + dy * -moveAmount;
			}
		}
	}

	#startAnimation() {
		const len = this.#particles.length;
		this.#ctx.fillStyle = this.bgColor;
		this.#ctx.lineWidth = 0.5;
		this.#ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		for (let i = 0; i < len; i++) {
			const particle = this.#particles[i];

			// get the particles inside the set distance and draw connection-lines
			for (let j = i + 1; j < len; j++) {
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
			// particle.draw(this.#ctx, this.strokeColor);
		}

		this.#animationId = requestAnimationFrame(
			this.#startAnimation.bind(this)
		); // otherwise on proto
	}

	#stopAnimation() {
		cancelAnimationFrame(this.#animationId);
		this.#animationId = null;
	}

	// Method to toggle animation state
	toggleAnimation() {
		if (this.#animationId) {
			this.#stopAnimation();
		} else {
			this.#startAnimation();
		}
	}
}
