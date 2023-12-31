// TODO1.1 encapsulate optional settings in objects if set => merge into options

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

     // TODO instead recal position of Particles!!!
	#resizeCanvas = () => {
		this.canvas.width = this.#offscreenCanvas.width = window.innerWidth;
		this.canvas.height = this.#offscreenCanvas.height = window.innerHeight;
		this.createParticles();
	};

    constructor(options) {
        const {
            canvasId = undefined,
            bgColor = '#000',
            numParticles = 100,
            particlesSize = 2,
            speed = 0.2,
            particlesColor = '#E1FF00',
            connectDistance = 100,
            strokeColor = '#4f4f4f',
            mouseDistance = 100,
            isFullScreen = true,
            withParticles = true,
            particlesCollision = true,
            withLines = true,
        } = options;

        this.canvas = document.getElementById(canvasId);
        this.#ctx = this.canvas.getContext('2d');
        this.#offscreenCanvas = document.createElement('canvas');
        this.#offscreenCtx = this.#offscreenCanvas.getContext('2d');

        this.numParticles = numParticles;
        this.speed = speed;
        this.strokeColor = strokeColor;
        this.bgColor = bgColor;
        this.particlesColor = particlesColor;
        this.particlesSize = particlesSize || 2;
        this.connectDistance = connectDistance;
        this.mouseDistance = mouseDistance;
        this.withLines = withLines;

        this.isFullScreen = isFullScreen;
        this.withParticles = withParticles;
        this.particlesCollision = particlesCollision;
        this.#particles = [];

        this.canvas.addEventListener('pointermove', this.#handleMouseMove.bind(this));
        if (this.isFullScreen) {
            window.addEventListener('resize', this.#resizeCanvas.bind(this));
        }

        if (this.isFullScreen) {
            this.#resizeCanvas();
        } else {
            this.createParticles();
        }
        this.#startAnimation();
    }

    createParticles() {
        this.#particles = [];

        for (let i = 0; i < this.numParticles; i++) {
            const { width, height } = this.canvas;
            const size = this.particlesSize;
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
                const length = Math.sqrt(dx * dx + dy * dy);
                dx /= length;
                dy /= length;

                const moveAmount = 5;
                particle.x = x + dx * -moveAmount;
                particle.y = y + dy * -moveAmount;
            }
        }
    }

    #drawElements2OffscreenCanvas() {
        const offCTX = this.#offscreenCtx;
        offCTX.fillStyle = this.bgColor;
        offCTX.lineWidth = 0.5;
        offCTX.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const len = this.numParticles;
        for (let i = 0; i < len; i++) {
            const particle = this.#particles[i];

            for (let j = i + 1; j < len; j++) {
                const otherParticle = this.#particles[j];
                const distance = this.#getDistance(
                    particle.x,
                    particle.y,
                    otherParticle.x,
                    otherParticle.y
                );

                if (this.withLines) {
                    const isInRadius = distance <= this.connectDistance;
                    if (isInRadius) {
                        offCTX.beginPath();
                        offCTX.moveTo(particle.x, particle.y);
                        offCTX.lineTo(otherParticle.x, otherParticle.y);
                        offCTX.strokeStyle = this.strokeColor;
                        offCTX.stroke();
                    }
                }
                if (
                    this.withParticles &&
                    this.particlesCollision &&
                    Math.abs(distance < particle.size)
                ) {
                    particle.xSpeed *= -1.001;
                    particle.ySpeed *= -1.001;
                    otherParticle.xSpeed *= -1.001;
                    otherParticle.ySpeed *= -1.001;
                }
            }

            particle.update();

            if (this.withParticles) particle.draw(offCTX, this.particlesColor);
        }
    }

    #startAnimation() {
        this.#drawElements2OffscreenCanvas();
        this.#ctx.drawImage(this.#offscreenCanvas, 0, 0);
        this.#animationId = requestAnimationFrame(this.#startAnimation.bind(this));
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
