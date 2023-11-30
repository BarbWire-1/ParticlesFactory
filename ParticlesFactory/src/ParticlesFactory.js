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

	constructor(options) {
		const config = {
			canvas: {
				id: undefined,
				width: 500,
				height: 500,
				fillStyle: '#000',
			},
			main: {
				numParticles: 100,
				speed: 0.2,
				mouseDistance: 100,
				isFullScreen: true,
				isResponsive: true,
			},
			particles: {
				fillStyle: '#ff0000',
				size: 2,
				draw: true,
				collision: false,
			},

			lines: {
				connectDistance: 100,
				strokeStyle: '#ffffff',
				draw: true,
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

		this.canvasEl = document.getElementById(this.canvas.id);

		this.#ctx = this.canvasEl.getContext('2d');
		//this.#ctx.fillStyle = this.canvas.fillStyle;
		this.#offscreenCanvas = document.createElement('canvas');
		this.#offscreenCtx = this.#offscreenCanvas.getContext('2d');

		// if (!this.isFullScreen) {
		// 	this.#offscreenCanvas.width = this.canvasEl.width;
		// 	this.#offscreenCanvas.height = this.canvasEl.height;
		// 	//console.log(this.#offscreenCanvas.width, this.canvasEl.height)// 300 150
		// }
		this.#particles = [];

		// INITIALISATION
		this.#initListeners();
		if (this.main.isFullScreen) {
			this.#resizeCanvas();
		} else {
			this.#createParticles();
		}
		this.#startAnimation();
	}

	#resizeCanvas = () => {
        if (!this.main.isFullScreen) {

			//console.log(this.canvasEl.width);
            this.#offscreenCanvas.width = this.canvasEl.width = this.canvas.width;
            this.#offscreenCanvas.height = this.canvasEl.height = this.canvas.height;
            if (this.main.isResponsive) this.#updatePosition();
            return;
		}
		if (this.main.isResponsive) this.#updatePosition();
		this.#offscreenCanvas.width = this.canvasEl.width = window.innerWidth;
		this.#offscreenCanvas.height = this.canvasEl.height =
			window.innerHeight;

		this.#createParticles();
    };

    #reduceSize() {
         {
			this.#offscreenCanvas.width = this.canvasEl.width;
			this.#offscreenCanvas.height = this.canvasEl.height;
			//console.log(this.#offscreenCanvas.width, this.canvasEl.height)// 300 150
		}
    }
	#initListeners = () => {
		this.canvasEl.addEventListener(
			'pointermove',
			this.#handleMouseMove.bind(this)
		);

		if (this.main.isFullScreen) {
			window.addEventListener('resize', this.#resizeCanvas.bind(this));
		}
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
    #drawElements2OffscreenCanvas() {
        if (!this.isFullScreen) this.#reduceSize()
		const offCTX = this.#offscreenCtx;

		//console.log(this.canvas.fillStyle); // undefined!

		offCTX.fillStyle = this.canvas.fillStyle; // '#000000'
		offCTX.lineWidth = 0.5;
		offCTX.fillRect(0, 0, this.canvasEl.width, this.canvasEl.height);

		const size = this.particles?.size || 2;
		const len = this.main.numParticles;

		for (let i = 0; i < len; i++) {
			const particle = this.#particles[i];
			particle?.update(this.particles.draw);

			for (let j = i + 1; j < len; j++) {
				const otherParticle = this.#particles[j];
				const distance = this.#getDistance(particle, otherParticle);

				if (this.lines?.draw)
					this.#drawLines(offCTX, particle, otherParticle, distance);
				if (this.particles?.collision)
					particle.particlesCollision(
						particle,
						otherParticle,
						distance
					);
			}

			if (this.particles?.draw) {
				if (!particle) return;
				particle.size = size
				particle.draw(offCTX, this.particles.fillStyle);
			}
		}

		this.#ctx.drawImage(this.#offscreenCanvas, 0, 0);
	}

	#drawLines(offCTX, particle, otherParticle, distance) {
		if (!particle || !otherParticle) return; // Exit early if either particle is undefined or null

		if (this.lines?.draw && distance <= this.lines.connectDistance) {
			offCTX.beginPath();
			offCTX.moveTo(particle.x, particle.y);
			offCTX.lineTo(otherParticle.x, otherParticle.y);
			offCTX.strokeStyle = this.lines.strokeStyle;
			offCTX.stroke();
		}
	}

	// behaviour
	#handleMouseMove(event) {
		if (!this.main.mouseDistance) return;

		const rect = this.canvasEl.getBoundingClientRect();
		const { left, top } = rect;
		const mouseX = event.clientX - left;
		const mouseY = event.clientY - top;

		for (let particle of this.#particles) {
			const { x, y } = particle;
			let distance = this.#getVector(x, y, mouseX, mouseY);

			if (distance && distance < this.main.mouseDistance) {
				let dx = mouseX - x;
				let dy = mouseY - y;
				const length = Math.sqrt(dx * dx + dy * dy);
				dx /= length;
				dy /= length;

				const moveAmount = 5;
				particle.x = x + dx * -moveAmount;
				particle.y = y + dy * -moveAmount;
			}
		}
	}

	// update on changes

	updateSpeed(value = this.main.speed) {
		//if (!this.main.isReactive) return;
		this.#particles.map((p) => p.updateSpeed(value));
	}
    #updatePosition() {
        const {width, height}= this.main.isFullScreen ?
            { width: window.innerWidth, height: window.innerHeight }
            : {width: this.canvas.width, height: this.canvas.height}
console.log(width, height)
		//if (!this.main.isReactive) return;
		this.#particles.map((p) =>
			p.updatePosition(
				this.canvasEl,
				width,
				height
			)
		);
	}

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
