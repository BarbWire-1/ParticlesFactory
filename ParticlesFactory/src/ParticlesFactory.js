// TODO add more optional variables??
// TODO1.1 convert into a factory function?
// TODO1.1.1 add offscreencanvas

// TODO2 change to baseParticle and extending shapes
// TODO2.1  add fillSyle for particleFill

// TODO add inputs for new added attributes

// TODO add particles-type and if none - do NOT draw particles only lines

// TODO add canvas dimensions other than full-screen
// TODO make responsiveness optional

// TODO logic mistake for NOT drawing particle when set to 0 - need a flag instead for draw or not draw?

// export const offscreenCanvas = document.createElement('canvas');
// let offCTX = offscreenCanvas.getContext('2d');

import { Particle } from './Particle.js';
export class ParticlesFactory {
	#ctx;
	#particles;
    #animationId;
    #offscreenCanvas;
    #offscreenCtx;

    #resizeCanvas = () => {
        this.canvas.width = this.#offscreenCanvas.width = window.innerWidth;
        this.canvas.height = this.#offscreenCanvas.height = window.innerHeight;
        this.createParticles();
    };



	constructor(options) {
        const {
            canvasId = undefined,
            numParticles = 100,
            particlesSize = 2,
            speed = 0.2,
            strokeColor = '#4f4f4f',
            bgColor = '#000',
            connectDistance = 100,
            mouseDistance = 100,
            particlesColor = '#E1FF00',
            //TODO - not sure about this - better provide aspect ratio for resiting
            isFullScreen = true,
            withParticles = true
		} = options;

		this.canvas = document.getElementById(canvasId);
        this.#ctx = this.canvas.getContext('2d');
        // Create the offscreen canvas and its context
		this.#offscreenCanvas = document.createElement('canvas');
        this.#offscreenCtx = this.#offscreenCanvas.getContext('2d');

        // attributes
		this.numParticles = numParticles;
		this.speed = speed;
		this.strokeColor = strokeColor;
		this.bgColor = bgColor;
		this.particlesColor = particlesColor;
		this.particlesSize = particlesSize;
		this.connectDistance = connectDistance;
        this.mouseDistance = mouseDistance;

        // FLAGS
        this.isFullScreen = isFullScreen;
        this.withParticles = withParticles;
        this.#particles = [];// holding particles for re-calculation
        // animationId for start/stop
        this.#animationId = null;


        // Listeners
		this.canvas.addEventListener('pointermove', (e) => {
			this.#handleMouseMove(e);
        });
        // use arrowFun to get surrounding context!
        if (this.isFullScreen) {
            window.addEventListener('resize', this.#resizeCanvas);
        }

        //INIT CALLS
        if (this.isFullScreen) {
            this.#resizeCanvas();
        } else {
            this.createParticles()
        }
        this.#startAnimation();
    }



	createParticles() {
		this.#particles = [];

		for (let i = 0; i < this.numParticles; i++) {
			const { width, height } = this.canvas;
			const size = this.particlesSize; // expose this?
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
        if (!this.mouseDistance) return;


		const rect = this.canvas.getBoundingClientRect();
		const { left, top } = rect;
		const mouseX = event.clientX - left;
		const mouseY = event.clientY - top;

		for (let particle of this.#particles) {
			const { x, y } = particle;
			let distance = this.#getDistance(x, y, mouseX, mouseY);

			if (distance && distance < this.mouseDistance) {
				let dx = mouseX - x;
				let dy = mouseY - y;
				// get the vector from mouse to particle pos
				const length = Math.sqrt(dx * dx + dy * dy);
				dx /= length;
				dy /= length;

				const moveAmount = 5; // variable to multiply offset

				particle.x = x + dx * -moveAmount;
				particle.y = y + dy * -moveAmount;
			}
		}
	}

	#startAnimation() {
        const len = this.#particles.length;
        const offCTX = this.#offscreenCtx;
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
			// draw particle shapes if this.withParticles set to true - default
			if (this.withParticles)
				particle.draw(offCTX, this.particlesColor);
		}
		// draw the completed offscreenCanvas to canvas : only one batched rerender
		this.#ctx.drawImage(this.#offscreenCanvas, 0, 0);
		this.#animationId = requestAnimationFrame(
			this.#startAnimation.bind(this)
		); // otherwise on proto
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
