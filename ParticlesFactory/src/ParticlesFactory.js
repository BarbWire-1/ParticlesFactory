//TODO 1.1 update readme - EXCEPTION colors on proxy!!!!!!

// TODO2 change to baseParticle and extending shapes - particleType

// TODO add canvas dimensions other than full-screen
// TODO make responsiveness optional

// export const offscreenCanvas = document.createElement('canvas');
// let offCTX = offscreenCanvas.getContext('2d');

import { Particle } from './Particle.js';

export class ParticlesFactory {
	#ctx;
	#particles;
	#animationId;
	#offscreenCanvas;
	#offscreenCtx;

	// TODO instead recalc position of Particles??
	#resizeCanvas = () => {
		this.canvas.width = this.#offscreenCanvas.width = window.innerWidth;
		this.canvas.height = this.#offscreenCanvas.height = window.innerHeight;

		this.createParticles();
	};
	#initListeners = () => {
		this.canvas.addEventListener(
			'pointermove',
			this.#handleMouseMove.bind(this)
		);
		if (this.main.isFullScreen) {
			window.addEventListener('resize', this.#resizeCanvas.bind(this));
		}
	};

	constructor(options) {
		this.main = {
			canvasId: '',
			fillStyle: '#000',
			numParticles: 100,
			speed: 0.2,
			mouseDistance: 100,
			isFullScreen: true,
		};

		if (options) {
			if (options.main) {
				this.main = Object.preventExtensions({
					...this.main,
					...options.main,
				});
			}
			if (options.particles) {
				this.particles = Object.preventExtensions({
					fillStyle: options.particles.fillStyle,
					size: options.particles.size || 2,
					draw: options.particles.draw,
					collision: options.particles.collision,
				});
			}
			if (options.lines) {
				this.lines = Object.preventExtensions({
					connectDistance: options.lines.connectDistance,
					strokeStyle: options.lines.strokeStyle,
					draw: options.lines.draw,
				});
			}
		}

		if (!this.particles && !this.lines) {
			throw new Error(
				'You need to define at least either a particles- or a lines-object.'
			);
		}

		this.canvas = document.getElementById(this.main.canvasId);
		this.#ctx = this.canvas.getContext('2d');
		this.#offscreenCanvas = document.createElement('canvas');
		this.#offscreenCtx = this.#offscreenCanvas.getContext('2d');

		this.#particles = [];

		// INITIALISATION
		this.#initListeners();

		if (this.main.isFullScreen) {
			this.#resizeCanvas();
		} else {
			this.createParticles();
		}
		this.#startAnimation();
	}

	createParticles(count = this.main.numParticles) {

		for (let i = 0; i < count; i++) {
			const { width, height } = this.canvas;
			const size = this.particles?.size || 2;

			this.#particles.push(
				new Particle(
					Math.random() * (width - 2 * size) + size,
					Math.random() * (height - 2 * size) + size,
					size,
					this.main.speed
				)
			);
		}
	}

    updateSpeed() {
        this.#particles.map(p => {
            // rondomize speed and direction
		p.xSpeed = this.main.speed * (Math.random() * 2 - 1);
		p.ySpeed = this.main.speed * (Math.random() * 2 - 1);
        })
    }


    updateNumParticles(newValue) {
        const currentCount = this.#particles.length;
        let difference = newValue - currentCount;
        if (newValue && difference) {
            if (difference > 0) {
                this.#addParticles(difference);
            } else {
                difference *= -1
                this.#removeParticles(currentCount, difference)

            }
        }
    }
    #addParticles(difference) {
        this.createParticles(difference);
    }
    #removeParticles(currentCount, difference) {
            this.#particles.splice(currentCount - difference, difference)
    }

	#getVector(x1, y1, x2, y2) {
		return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }

    #getDistance(particle, otherParticle) {
        return this.#getVector(particle.x,
			particle.y,
			otherParticle.x,
            otherParticle.y
        )
    }

	#handleMouseMove(event) {
		if (!this.main.mouseDistance) return;

		const rect = this.canvas.getBoundingClientRect();
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

	#calculateCollision(particle, otherParticle, distance) {


		if (this.particles?.collision && Math.abs(distance < particle?.size)) {
			particle.xSpeed *= -1.001;
			particle.ySpeed *= -1.001;
			otherParticle.xSpeed *= -1.001;
			otherParticle.ySpeed *= -1.001;
		}
	}

	#drawElements2OffscreenCanvas() {
		const offCTX = this.#offscreenCtx;
		offCTX.fillStyle = this.main.fillStyle;
		offCTX.lineWidth = 0.5;
		offCTX.fillRect(0, 0, this.canvas.width, this.canvas.height);

		const size = this.particles.size;
		const len = this.main.numParticles;

		for (let i = 0; i < len; i++) {
			const particle = this.#particles[i];
            particle?.update();


			for (let j = i + 1; j < len; j++) {
                const otherParticle = this.#particles[ j ];
                const distance = this.#getDistance(particle, otherParticle);

				if (this.lines?.draw)
					this.#drawLines(offCTX, particle, otherParticle, distance);
				if (this.particles?.collision)
					this.#calculateCollision(particle, otherParticle, distance);
			}

			if (this.particles.draw) {
				if (!particle) return;
				particle.size = size;
				particle.draw(offCTX, this.particles.fillStyle);
			}
		}

		this.#ctx.drawImage(this.#offscreenCanvas, 0, 0);
	}

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
