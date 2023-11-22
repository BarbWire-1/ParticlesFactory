// TODO add more optional variables??
// TODO1.1 convert into a factory function?
// TODO1.1.1 add offscreencanvas

// TODO2 change to baseParticle and extending shapes
// TODO2.1  add fillSyle for particleFill


// TODO add inputs for new added attributes


export const offscreenCanvas = document.createElement('canvas');
let offCTX = offscreenCanvas.getContext('2d');

import { Particle } from './Particle.js';
export class ParticlesFactory {
	#ctx;
	#particles;
	#animationId;

	constructor(options) {
        const {
            canvasId = '',
            numParticles = 300,
            particleSize = 5,
			speed = 0.5,
			strokeColor = '#fff',
			bgColor = '#000',
			connectDistance = 100,
            mouseDistance = 100,
            particleColor = 'red'
		} = options;

		this.canvas = document.getElementById(canvasId);
		this.#ctx = this.canvas.getContext('2d');
		this.numParticles = numParticles;
		this.speed = speed;
		this.strokeColor = strokeColor;
        this.bgColor = bgColor;
        this.particleColor = particleColor;
        this.particleSize = particleSize;

		this.connectDistance = connectDistance;
		this.mouseDistance = mouseDistance;
		this.#animationId = null;

		this.#particles = [];

		this.canvas.addEventListener('pointermove', (e) => {
			this.#handleMouseMove(e);
        });

        // // Create the offscreen canvas and its context
        // this.offscreenCanvas = document.createElement('canvas');
        // this.offscreenCtx = this.offscreenCanvas.getContext('2d');

		this.createParticles();
        this.#startAnimation();



        offscreenCanvas.width = this.canvas.width;
        offscreenCanvas.height = this.canvas.height;
	}

	createParticles() {
		this.#particles = [];

		for (let i = 0; i < this.numParticles; i++) {
			const { width, height } = this.canvas;
			const size = this.particleSize; // expose this?
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
		offCTX.fillStyle = this.bgColor;
		offCTX.lineWidth = 0.5;
		offCTX.fillRect(0, 0, this.canvas.width, this.canvas.height);

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
					offCTX.beginPath();
					offCTX.moveTo(particle.x, particle.y);
					offCTX.lineTo(otherParticle.x, otherParticle.y);
					offCTX.strokeStyle = this.strokeColor;
					offCTX.stroke();
				}
			}

			particle.update();
			//TODO call only optional for different color??
			particle.draw(offCTX, this.particleColor);
		}
        // Inside your class method where you want to draw the offscreen canvas onto the main canvas
this.#ctx.drawImage(offscreenCanvas, 0, 0);
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
