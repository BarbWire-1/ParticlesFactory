//TODO 1.1 update readme - EXCEPTION colors on proxy!!!!!!

// TODO2 change to baseParticle and extending shapes - particleType
// TODO add a max-speed??

// private methods don't get inherited to child-classes - so that idea doesn't work :(

import { Particle } from './Particle.js';

export class ParticlesFactory {
	#ctx;
	#particles;
	#animationId;
	#offscreenCanvas;
	#offscreenCtx;

	constructor(options) {
		const config = {
			canvas: {
				id: undefined,
				width: 500,
				height: 500,
			},
			main: {
				numParticles: 100,
				speed: 0.2,
				mouseDistance: 100,
				fillStyle: '#000',
				isFullScreen: true,
				isResponsive: true,
			},
			particles: {
				fillStyle: '#ff0000',
				size: 2,
				draw: true,
				collision: false,
				opacity: 1,
			},
			lines: {
				connectDistance: 100,
				strokeStyle: '#ffffff',
				draw: true,
				lineWidth: 0.5,
				opacity: 1,
			},
		};

		if (options) {
			// create the objects by merging
			// allows to instantiate with default values when only the object-name itself is passed as arg
			for (const key in options) {
				if (key) {
					this[key] = Object.preventExtensions({
						...config[key],
						...options[key],
					});
				}
			}
		}

		if (!this.particles && !this.lines) {
			throw new Error(
				'You need to define at least either a particles- or a lines-object.'
			);
		}

		this.#particles = []; // holding all active particles

		// INITIALISATION
		this.#setupCanvas();
		this.#initListeners();
		this.#createParticles();
		this.#startAnimation();
	}

	#setupCanvas() {
		this.canvasEl = document.getElementById(this.canvas.id);
		this.#ctx = this.canvasEl.getContext('2d');
		this.#offscreenCanvas = document.createElement('canvas');
		this.#offscreenCtx = this.#offscreenCanvas.getContext('2d');

		this.getCanvasSize();
	}

	getCanvasSize = () => {
		const { width, height } = this.#calculateDimensions();

		const prevDimensions = this.#storePreviousDimensions();
		const particleRelativePositions =
			this.#calculateRelativeCoords(prevDimensions);

		this.#setCanvasDimensions(width, height);

		if (this.main.isResponsive) {
			this.#updateParticlePositions(
				width,
				height,
				particleRelativePositions
			);
		}
	};

	#calculateDimensions() {
		const isMobile = window.innerWidth < 750;
		const screenWidth = isMobile ? screen.availWidth : window.innerWidth;
		const screenHeight = isMobile ? screen.availHeight : window.innerHeight;
		const width = this.main.isFullScreen ? screenWidth : this.canvas.width;
		const height = this.main.isFullScreen
			? screenHeight
			: this.canvas.height;
		return { width, height };
	}

	#storePreviousDimensions() {
		return {
			width: this.canvasEl.width,
			height: this.canvasEl.height,
		};
	}

	#calculateRelativeCoords(prevDimensions) {
		return this.#particles.map((particle) => ({
			xPercent: particle.x / prevDimensions.width,
			yPercent: particle.y / prevDimensions.height,
		}));
	}

	#setCanvasDimensions(width, height) {
		this.#offscreenCanvas.width = this.canvasEl.width = width;
		this.#offscreenCanvas.height = this.canvasEl.height = height;
	}

	#updateParticlePositions(width, height, particleRelativePositions) {
		this.#updateParticleCoords(width, height, particleRelativePositions);
	}

	#initListeners = () => {
		this.canvasEl.addEventListener('mousemove', (event) => {
			this.#particles.forEach((particle) => {
				particle.handleMouseMove(event, this.main.mouseDistance);
			});
		});

		// if (this.main.isFullScreen) {
		window.addEventListener('resize', this.getCanvasSize.bind(this));
		//}
	};

	// helpers
	#getVector(x1, y1, x2, y2) {
		return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
	}

	#getDistance(particle, otherParticle) {
		if (!particle || !otherParticle) return;
		return this.#getVector(
			particle.x,
			particle.y,
			otherParticle.x,
			otherParticle.y
		);
	}

	// initial creation
	#createParticles(count = this.main.numParticles) {
		for (let i = 0; i < count; i++) {
			const { width, height } = this.#offscreenCanvas;
			const size = this.particles?.size || 2;

			this.#particles.push(
				new Particle(
					this.#offscreenCanvas,
					Math.random() * (width - 2 * size) + size,
					Math.random() * (height - 2 * size) + size,
					size,
					this.main.speed,
					this.particles.fillStyle
				)
			);
		}
	}
	// drawing
	// not nice, but keeps all operations on particles in one loop
	#drawElements2OffscreenCanvas() {
		const size = this.particles?.size || 2;
		const len = this.main.numParticles;

		// draw background rectangle
		this.#offscreenCtx.fillStyle = this.main.fillStyle;
		this.#offscreenCtx.fillRect(
			0,
			0,
			this.canvasEl.width,
			this.canvasEl.height
		);

		// handle all behaviour of particle.
		// get x,y
		// optional draw particle and/or draw lines
		for (let i = 0; i < len; i++) {
			const particle = this.#particles[i];

			particle.update(this.particles.draw); // boolean/flag
			this.lines?.draw && this.#handleLinesAndCollision(particle, i, len); // pass to inner loop

			if (this.particles?.draw) {
				if (!particle) return;
				particle.size = size;
				particle.draw(
					this.#offscreenCtx,
					this.particles.fillStyle,
					this.particles.opacity
				);
			}
		}
		this.#renderOffscreenCanvas();
	}

	// inner loop to get otherParticle
	#handleLinesAndCollision(particle, startIndex, len) {
		for (let j = startIndex + 1; j < len; j++) {
			const otherParticle = this.#particles[j];
			const distance = this.#getDistance(particle, otherParticle);

            this.lines.draw &&
			this.#drawLines(
				this.#offscreenCtx,
				particle,
				otherParticle,
				distance
			);

			this.particles?.collision &&
                particle.particlesCollision(particle, otherParticle, distance);

		}
	}

	#renderOffscreenCanvas() {
		this.#ctx.drawImage(this.#offscreenCanvas, 0, 0);
	}

	#drawLines(offCTX, particle, otherParticle, distance) {
		if (!particle || !otherParticle || !this.lines?.draw) return;
		const isCloseEnough = distance <= this.lines.connectDistance;
		// set coords of connection -lines if in connectionDistance
		if (isCloseEnough) {
			offCTX.beginPath();
			offCTX.moveTo(particle.x, particle.y);
			offCTX.lineTo(otherParticle.x, otherParticle.y);
			offCTX.strokeStyle = this.lines.strokeStyle;
			offCTX.lineWidth = this.lines.lineWidth;
			offCTX.globalAlpha = this.lines.opacity;
			offCTX.stroke();
		}
	}

	// Update particle coordinates with stored relative positions
	#updateParticleCoords(newWidth, newHeight, relativePositions) {
		this.#particles.forEach((particle, index) => {
			const { xPercent, yPercent } = relativePositions[index];

			particle.updatePosition(newWidth, newHeight, xPercent, yPercent);
		});
	}

	// update on changes
	updateSpeed() {
		this.#particles.map((p) => p.updateSpeed(this.main.speed));
	}

	// update instead of recreate by getting the difference old/new
	// create and add or remove
	updateNumParticles(newValue) {
		const currentCount = this.#particles.length;
		let difference = newValue - currentCount;

		newValue && difference && difference > 0
			? this.#addParticles(difference)
			: this.#removeParticles(currentCount, -difference);

		this.main.numParticles = currentCount + difference;
	}
	#addParticles(difference) {
		this.#createParticles(difference);
	}
	#removeParticles(currentCount, difference) {
		this.#particles.splice(currentCount - difference, difference);
		this.numParticles = this.#particles.length;
	}

	// ANIMATION
	#startAnimation() {
		this.#drawElements2OffscreenCanvas();
		this.#ctx.drawImage(this.#offscreenCanvas, 0, 0);
		this.#animationId = requestAnimationFrame(
			this.#startAnimation.bind(this)
		);
	}

	#stopAnimation() {
		cancelAnimationFrame(this.#animationId);
		this.#animationId = null;
	}

	toggleAnimation() {
		if (this.#animationId) {
			this.#stopAnimation();
		} else {
			this.#startAnimation();
		}
	}
}
