//TODO 1.1 update readme - EXCEPTION colors on proxy!!!!!!
// TODO 1.1.1 chack all loops for looping over constants - remove obsolete bool-checks!!!!
// TODO 1.1.2 batch drawing particles and lines!

// TODO2 change to baseParticle and extending shapes - particleType
// TODO add a max-speed??

// TODO check early returns, add errorHandling, comments, docu, update readme
// TODO check performance - esp calculating multiple times for structures basing on same coords/results

//TODO batch drawing to offscreen of lines and particles!
// TODO get i in this.#particles to reuse coords!


//TODO WHY do some style updates need a function to map, while others work perfectly without???
// all in particle constructor need to be set individually?

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

	#initListeners = () => {
		this.canvasEl.addEventListener('mousemove', (event) => {
			this.#particles.forEach((particle) => {
				particle.handleMouseMove(event, this.main.mouseDistance);
			});
		});

		// if (this.main.isFullScreen) {
		window.addEventListener('resize', (e) => {
			this.getCanvasSize();
		}); // why need "bind" herre???
		//}
	};

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

	// get the calculated canvas diminsions and update particles coords accordingly
	getCanvasSize = () => {
		const { isResponsive /*, isFullScreen */ } = this.main;
		const { width, height, prevDimensions } = this.#calculateCanvasSize();

		this.#setCanvasSize(width, height);

		if (isResponsive /*&& isFullScreen*/) {
			// TODO decide whether to check for fullScreen here to
			this.#updateParticleCoords(width, height, prevDimensions);
		}
	};

	// get the canvas size depending on flags and device-dimensions
	// need to use available(!) screen for mobiles
	#calculateCanvasSize() {
		const isMobile = window.innerWidth < 750;

		const screenWidth = isMobile ? screen.availWidth : window.innerWidth;
		const screenHeight = isMobile ? screen.availHeight : window.innerHeight;

		const width = this.main.isFullScreen ? screenWidth : this.canvas.width;
		const height = this.main.isFullScreen
			? screenHeight
			: this.canvas.height;

		const prevDimensions = {
			width: this.canvasEl.width,
			height: this.canvasEl.height,
		};

		return { width, height, prevDimensions };
	}

	#setCanvasSize(width, height) {
		this.#offscreenCanvas.width = this.canvasEl.width = width;
		this.#offscreenCanvas.height = this.canvasEl.height = height;
	}

	// update particles coords by maintaining prev RELATIVE position
	#updateParticleCoords(width, height, prevDimensions) {
		const dWidth = width / prevDimensions.width;
		const dHeight = height / prevDimensions.height;

		this.#particles.forEach((particle) => {
			particle.x *= dWidth;
			particle.y *= dHeight;
		});
	}

	// helper
	#calculateDistance(x1, y1, x2, y2) {
		const a = x2 - x1;
		const b = y2 - y1;
		const c = Math.sqrt(a ** 2 + b ** 2); // ;)
		return c;
	}

	#getDistance(particle, otherParticle) {
		if (!particle || !otherParticle) return;
		return this.#calculateDistance(
			particle.x,
			particle.y,
			otherParticle.x,
			otherParticle.y
		);
	}

	// drawing
	// not nice, but keeps all operations on particles in one loop
	#drawElements2OffscreenCanvas() {
		const offCtx = this.#offscreenCtx;

		// Set the background with globalAlpha 1
		offCtx.globalAlpha = 1;
		offCtx.fillStyle = this.main.fillStyle;
		offCtx.fillRect(0, 0, this.canvasEl.width, this.canvasEl.height);
		const len = this.main.numParticles;

		// Define an array to store line data
		const linesToDraw = [];

		// handle all behaviour of particle.
		// get x,y
		// optional draw particle and/or draw lines
		// Move constant property settings outside the loop
		const { collision, draw, fillStyle, opacity } = this.particles || {};

		for (let i = 0; i < len; i++) {
			const particle = this.#particles[i];
			particle.updateCoords(draw); // bool as param, gets passed to adjust and recalc position whether drawn or not

			// Handle lines and collision
            for (let j = i + 1; j < len; j++) {

				const otherParticle = this.#particles[j];
				const distance = this.#getDistance(particle, otherParticle);

				if (collision) {
					particle.particlesCollision(
						particle,
						otherParticle,
						distance
					);
				}

				// Store the index-pairs of particles to connect
				if (
					this.lines?.draw &&
					distance <= this.lines.connectDistance
				) {
					linesToDraw.push({ index1: i, index2: j });
				}
			}
		}

		// batch-draw lines
        linesToDraw.forEach(({ index1, index2 }) => {

			const particle1 = this.#particles[index1];
			const particle2 = this.#particles[index2];

			//draw a line between each stored particles-pair to be connected
			this.#drawLine(offCtx, particle1, particle2);
		});
        // batch-draw all particles - if to draw
		if (draw) {
			this.#particles.forEach((p) =>
				p.drawParticle(offCtx, fillStyle, opacity)
			);
		}

		this.#renderOffscreenCanvas();
	}

	#renderOffscreenCanvas() {
		this.#ctx.drawImage(this.#offscreenCanvas, 0, 0);
	}


    #drawLine(offCtx, particle1, particle2) {

		const { x: x1, y: y1 } = particle1;
		const { x: x2, y: y2 } = particle2;

		// Access line-style from the scope
		const { strokeStyle, lineWidth, opacity } = this.lines;

		// Draw lines using stored coordinates
		offCtx.beginPath();
		offCtx.moveTo(x1, y1);
		offCtx.lineTo(x2, y2);
		offCtx.strokeStyle = strokeStyle;
		offCtx.lineWidth = lineWidth;
		offCtx.globalAlpha = opacity;
		offCtx.stroke();
	}

	// update on changes
	setSpeed() {
		this.#particles.map((p) => p.setSpeed(this.main.speed));
	}

	// update instead of recreate by getting the difference old/new
	// create and add or remove
	setNumParticles(newValue) {
		const currentCount = this.#particles.length;
		let difference = newValue - currentCount;

		newValue && difference && difference > 0
			? this.#addParticles(difference)
			: this.#removeParticles(currentCount, -difference);

		this.main.numParticles = currentCount + difference;
	}

	setParticlesSize() {
		this.#particles.map((p) => (p.size = this.particles.size));
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
