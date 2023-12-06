//TODO 1.1 update readme - EXCEPTION colors on proxy!!!!!!
// TODO 1.1.1.1 - change back to simple logic: 3 times as performant!!!!!!!!!!

// TODO2 change to baseParticle and extending shapes - particleType
// TODO add a max-speed??

// TODO check early returns, add errorHandling, comments, docu, update readme
// TODO check performance - esp calculating multiple times for structures basing on same coords/results

//TODO combine collisionDetections boundaries/otherParticle
// better to pass ALL common stuff in constructor of Particle

// private methods don't get inherited to child-classes - so that idea doesn't work :(

//TODO add a helper function: getRatio (used several times)

// TODO unify create and update in a draw
// move helpers to an own utils.js to use wherever needed

import { Particle } from './Particle.js';

export class ParticlesFactory {
	#ctx;
	#particles;
	#animationId;
	#offscreenCanvas;
	#offscreenCtx;
	#originalBaseSize;

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
				shape: 'circle',
				fillStyle: '#ff0000',
				randomFill: true,
				noFill: false,
				stroke: true,
				size: 2,
				randomSize: true,
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
		this.#originalBaseSize = this.particles?.size || 2; // Store the original base size

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
		this.canvasEl.addEventListener('pointermove', (event) => {
			this.#particles.forEach((particle) => {
				particle.handleMouseMove(event, this.main.mouseDistance);
			});
		});

		// if (this.main.isFullScreen) {
		window.addEventListener('resize', this.getCanvasSize.bind(this));
		//}
	};
	#randomHex = () => {
		let number = (Math.random() * 0xffffff) >> 0;
		return '#' + number.toString(16).padStart(6, '0');
	};

	// initial creation
	#createParticles(count = this.main.numParticles) {
		const { width, height } = this.#offscreenCanvas;
		const size = this.particles?.size || 2;

		while (count) {
			const adjustedFill = this.particles.randomFill
				? this.#randomHex() // the particle gets an individual fill!
				: this.particles.fillStyle;

			const adjustedSize =
				size *
				(this.particles.randomSize
					? Math.max(0.2, Math.random()) // the particle gets an individual size!
					: 1);
			const { x, y } = {
				x: Math.random() * (width - 2 * size) + size,
				y: Math.random() * (height - 2 * size) + size,
			};

			this.#particles.push(
				new Particle(
					this.#offscreenCanvas,
					x,
					y,
					adjustedSize,
					this.main.speed,
					adjustedFill,
					this.particles.shape
				)
			);
			count--;
		}
	}

	// get the calculated canvas diminsions and update particles coords accordingly
	getCanvasSize = () => {
		const { isResponsive /*, isFullScreen */ } = this.main;
		const { width, height, prevDimensions } = this.#calculateCanvasSize();

		this.#setCanvasSize(width, height);

		if (isResponsive /*&& isFullScreen*/) {
			this.#updateParticleCoords(width, height, prevDimensions);
		}
	};

	// get the canvas size depending on flags and device-dimensions
	// need to use available(!) screen for mobiles
	#calculateCanvasSize() {
		const { innerWidth, innerHeight } = window;
		const { availWidth, availHeight } = screen;
		const isMobile = innerWidth < 750;

		const isFullScreen = this.main.isFullScreen;

		const sWidth = isMobile ? availWidth : innerWidth;
		const sHeight = isMobile ? availHeight : innerHeight;

		const width = isFullScreen ? sWidth : this.canvas.width;
		const height = isFullScreen ? sHeight : this.canvas.height;

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

	//     getRatio(attribute, newValue, oldValue) {
	//         const ratio = newValue / oldValue;
	//         attribute *= ratio;
	//         oldValue = newValue;
	//
	//     }
	// update randomSize relative on each particle IF randomSize
	// in handleInterface... handled currently
	changeBaseSize(newBaseSize) {
		const scaleFactor = newBaseSize / this.#originalBaseSize;
		//console.log(scaleFactor)

		this.#particles.forEach((particle) => {
			particle.size *= scaleFactor;
		});
		this.#originalBaseSize = newBaseSize;
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
	#updateCanvas() {
		const len = this.main.numParticles;

		const {
			draw: drawParticles,
			collision,
			randomFill,
			noFill,
			fillStyle,
			stroke,
			opacity,
			randomSize,
			size,
			shape,
		} = this.particles;
		//console.log(stroke)
		let strokeStyle = stroke ? this.lines.strokeStyle : undefined;

		// draw background rectangle
		this.#offscreenCtx.fillStyle = this.main.fillStyle;
		this.#offscreenCtx.globalAlpha = 1;
		this.#offscreenCtx.fillRect(
			0,
			0,
			this.canvasEl.width,
			this.canvasEl.height
		);

		this.#particles.forEach((particle, i) => {
			particle.updateCoords(drawParticles); // boolean/flag - needed for translating IF drawn

			((this.lines.draw && +this.lines.connectDistance) || collision) &&
				this.#handleLinesAndCollision(particle, i, len); // loop over otherParticle

			if (drawParticles) {
				let adjustedFillStyle = noFill
					? 'transparent'
					: randomFill
					? particle.fillStyle
					: fillStyle; // default

				particle.drawParticle(
					this.#offscreenCtx,
					adjustedFillStyle,
					opacity,
					randomSize ? particle.size : size,
					shape,
					strokeStyle
				);
			}
		});
		this.#renderOffscreenCanvas();
	}

	// inner loop to get otherParticle - distance
	// check for flags and recalculate/draw in case
	#handleLinesAndCollision(particle, startIndex, len) {
		for (let j = startIndex + 1; j < len; j++) {
			const otherParticle = this.#particles[j];
			const distance = this.#getDistance(particle, otherParticle);

			if (this.particles?.collision) {
				particle.particlesCollision(particle, otherParticle, distance);
			}

			if (this.lines?.draw) {
				this.#drawLine(
					this.#offscreenCtx,
					particle,
					otherParticle,
					distance
				);
			}
		}
	}

	#renderOffscreenCanvas() {
		this.#ctx.drawImage(this.#offscreenCanvas, 0, 0);
	}

	#drawLine(offCTX, particle, otherParticle, distance) {
		if (!particle || !otherParticle || !this.lines?.draw) return;

		// destructure used objects
		const { strokeStyle, lineWidth, opacity, connectDistance } = this.lines;
		const isCloseEnough = distance <= connectDistance;

		// set coords of connection -lines if in connectionDistance
		if (isCloseEnough) {
			const { x: x1, y: y1 } = particle;
			const { x: x2, y: y2 } = otherParticle;

			offCTX.beginPath();
			offCTX.moveTo(x1, y1);
			offCTX.lineTo(x2, y2);
			offCTX.strokeStyle = strokeStyle;
			offCTX.lineWidth = lineWidth;
			offCTX.globalAlpha = opacity;
			offCTX.stroke();
		}
	}
	changeColorMode() {
		this.#particles.map((p) => (p.fillStyle = this.particles.fillstyle));
	}

	// update on changes
	setSpeed() {
		this.#particles.map((p) => p.updateSpeed(this.main.speed));
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
    
	#addParticles(difference) {
		this.#createParticles(difference);
    }

	#removeParticles(currentCount, difference) {
		this.#particles.splice(currentCount - difference, difference);
		this.numParticles = this.#particles.length;
	}

	// ANIMATION
	#startAnimation() {
		this.#updateCanvas();
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

	// ONLY IN EXAMPLE TO GET CURRENT STATE FOR CONFIG
	async savePropsStatus2File() {
		// Get all properties (excluding methods and canvasEl) of the current instance
		const properties = Object.keys(this).filter(
			(key) =>
				typeof this[key] !== 'function' && this[key] !== this.canvasEl
		);

		const propertyValues = properties.map((key) => {
			const value = this[key];
			const obj = `
            ${JSON.stringify(key)}:
                ${JSON.stringify(value)}`;
			// string representation of the property and its value
			return obj;
		});

		// convert to formatted string
		const propertiesText = `{
            ${propertyValues.join(', \n')}
    }`;

		// BLOB
		const blob = new Blob([propertiesText], { type: 'JSON' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'particles-factory-config.json';
		link.click();
	}
}
