//TODO 1.1 update readme - EXCEPTION colors on proxy!!!!!!

// TODO2 change to baseParticle and extending shapes - particleType

// TODO add canvas dimensions other than full-screen

// TODO add a max-speed??

//TODO1.1.1 why don't particles correct get recalculated when change from fullSize to fix dimension?
//TODO1.1.1.1 check entire logic of resizing and recalculating particles. decouple and get in animation by flag (???)
// private methods don't get inherited to child-classes - so that idea doesn't work :(

// export const offscreenCanvas = document.createElement('canvas');
// let offCTX = offscreenCanvas.getContext('2d');

import { Particle } from './Particle.js';

export class ParticlesFactory {
	#ctx;
	#particles;
	#animationId;
	#offscreenCanvas;
	#offscreenCtx;
	#mouseX;
    #mouseY;
    #width;
    #height;

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
				lineWidth: 0.3,
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

		this.#particles = [];
		this.#mouseX = undefined;
        this.#mouseY = undefined;
        this.#width = undefined;
        this.#height = undefined;

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
		const { isResponsive, isFullScreen } = this.main;

		if (isResponsive) {
			this.#updatePosition();
		}

		this.#width = isFullScreen ? window.innerWidth : this.canvas.width;
		this.#height = isFullScreen ? window.innerHeight : this.canvas.height;

		this.#offscreenCanvas.width = this.canvasEl.width = this.#width;
		this.#offscreenCanvas.height = this.canvasEl.height = this.#height;
	};

	#initListeners = () => {
		this.canvasEl.addEventListener(
			'pointermove',
			this.#getMousePosition.bind(this)
		);

		if (this.main.isFullScreen) {
			window.addEventListener('resize', this.getCanvasSize.bind(this));
		}
	};
	#getMousePosition(event) {
		//console.log(event)
		const rect = this.canvasEl.getBoundingClientRect();
		const { left, top } = rect;
		this.#mouseX = event.clientX - left;
		this.#mouseY = event.clientY - top;
	}
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
		// console.log("count from #createParticles: " + count)
		// console.log(this.main.numParticles)
		for (let i = 0; i < count; i++) {
			const { width, height } = this.canvasEl;
			const size = this.particles?.size || 2;

			this.#particles.push(
				new Particle(
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

		// Clear canvas by drawing the background rectangle
		this.#offscreenCtx.fillStyle = this.main.fillStyle;
		this.#offscreenCtx.fillRect(
			0,
			0,
			this.canvasEl.width,
			this.canvasEl.height
		);

		for (let i = 0; i < len; i++) {
			const particle = this.#particles[i];

			this.#handleMouseMove(particle);

			particle.update(this.canvasEl, this.particles.draw);

			if (this.lines?.draw) {
				this.#handleLinesAndCollision(particle, i, len);
			}

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

	#handleMouseMove(particle) {
		if (this.#mouseX && this.main.mouseDistance) {
			particle.handleMouseMove(
				this.#mouseX,
				this.#mouseY,
				this.main.mouseDistance
			);
		}
	}

	#handleLinesAndCollision(particle, startIndex, len) {
		for (let j = startIndex + 1; j < len; j++) {
			const otherParticle = this.#particles[j];
			const distance = this.#getDistance(particle, otherParticle);

			this.#drawLines(
				this.#offscreenCtx,
				particle,
				otherParticle,
				distance
			);

			if (this.particles?.collision) {
				particle.particlesCollision(particle, otherParticle, distance);
			}
		}
	}

	#renderOffscreenCanvas() {
		this.#ctx.drawImage(this.#offscreenCanvas, 0, 0);
	}

	#drawLines(offCTX, particle, otherParticle, distance) {
		if (!particle || !otherParticle) return;

		// set coords of connection -lines if in set connectionDistance
		if (this.lines?.draw && distance <= this.lines.connectDistance) {
			offCTX.beginPath();
			offCTX.moveTo(particle.x, particle.y);
			offCTX.lineTo(otherParticle.x, otherParticle.y);
			offCTX.strokeStyle = this.lines.strokeStyle;
			offCTX.lineWidth = this.lines.lineWidth;
			offCTX.globalAlpha = this.lines.opacity;
			offCTX.stroke();
		}
	}

	// update on changes
	updateSpeed(value = this.main.speed) {
		this.#particles.map((p) => p.updateSpeed(value));
	}
	// pass new canvasSize
	// to update for responsive relative re-positioning of particles
	#updatePosition() {
		const { isFullScreen } = this.main;
		const canvasWidth = isFullScreen
			? window.innerWidth
			: this.canvas.width;
		const canvasHeight = isFullScreen
			? window.innerHeight
			: this.canvas.height;

		this.#particles.map((p) =>
			p.updatePosition(this.canvasEl, canvasWidth, canvasHeight)
		);
	}

	// update instead of recreate by getting the difference old/new
	// create add or remove
	updateNumParticles(newValue) {
		//if (!this.main.isReactive) return;
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

	// animation
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
