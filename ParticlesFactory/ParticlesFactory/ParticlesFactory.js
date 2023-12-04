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

// TODO use web worker?????????
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
			this.#particles.forEach((p) => {
				p.handleMouseMove(event, this.main.mouseDistance);
			});
		});

		// if (this.main.isFullScreen) {
		window.addEventListener('resize', () => {
			this.getCanvasSize();
		}); // get scope by using arrowFunction - else would need to bind(this)
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
					this.particles.fillStyle,
					this.particles.opacity
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
	//ugly like hell, but keeps all operations on particles and batchdrawing in one loop

	// change this to create all rects/lines in here but DRAW them in one  - now having 3 loops for calc /draw
	#drawElements2OffscreenCanvas() {
		const offCtx = this.#offscreenCtx;

		// Set the background with globalAlpha 1
		offCtx.globalAlpha = 1;
		offCtx.fillStyle = this.main.fillStyle;
		offCtx.fillRect(0, 0, this.canvasEl.width, this.canvasEl.height);
		const len = this.main.numParticles;

		const { collision, draw, fillStyle, opacity } = this.particles || {};
		const drawLines = this.lines?.draw;

		if ((draw || (collision && drawLines)) && len > 0) {
			const particleCoords = []; // Collect particle coordinates once

			offCtx.beginPath(); // Begin drawing all elements

			for (let i = 0; i < len; i++) {
				const particle = this.#particles[i];
				particle.updateCoords(draw);

				const cx = particle.x - this.particles.size / 2;
				const cy = particle.y - this.particles.size / 2;

				if (draw) {
					offCtx.fillStyle = fillStyle;
					offCtx.globalAlpha = opacity;
					offCtx.rect(
						cx,
						cy,
						this.particles.size,
						this.particles.size
					); // Add rectangle paths for particles
				}

				if (collision && drawLines) {
					particleCoords.push({ x: particle.x, y: particle.y }); // Store coordinates
					for (let j = i + 1; j < len; j++) {
						const otherParticle = this.#particles[j];
						const distance = this.#getDistance(
							particle,
							otherParticle
						);

						const isCloseEnough =
							distance <= this.lines.connectDistance;

						if (isCloseEnough) {
							offCtx.moveTo(particle.x, particle.y);
							offCtx.lineTo(otherParticle.x, otherParticle.y);
						}
					}
				}
			}

			if (draw) {
				offCtx.fill(); // Fill all added rectangles for particles in one go
			}

			if (collision && drawLines) {
				const { strokeStyle, lineWidth, opacity } = this.lines;
				offCtx.strokeStyle = strokeStyle;
				offCtx.lineWidth = lineWidth;
				offCtx.globalAlpha = opacity;

				offCtx.stroke(); // End drawing lines
			}

			this.#renderOffscreenCanvas();
		}
	}

	#renderOffscreenCanvas() {
		this.#ctx.drawImage(this.#offscreenCanvas, 0, 0);
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
