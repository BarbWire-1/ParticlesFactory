// gets the canvas passed in calling methods from the consuming class
//TODO pass canvas as arg where needed instead in constructor?
export class Particle {
    constructor (canvas, x, y, size, speed, fillStyle) {

		this.canvas = canvas;
		this.x = x;
		this.y = y;
		this.size = size;
        this.speed = speed;
        this.fillStyle = fillStyle;
        //this.type = type;

		this.updateSpeed(speed);
	}

    drawParticle(ctx, fillColor, opacity, size, shape) {
    ctx.fillStyle = fillColor || this.fillStyle;
    ctx.globalAlpha = opacity;

    if (shape === 'circle') {
        ctx.beginPath();
        ctx.arc(this.x, this.y, size / 2, 0, Math.PI * 2);
        ctx.fill();

    } else if (shape === 'square') {
        // Center the particle on point
        let cx = this.x - size / 2;
        let cy = this.y - size / 2;

        ctx.fillRect(cx, cy, size, size);

    } else if (shape === 'hexagon') {
        ctx.beginPath();
        const sides = 6; // Number of sides for the polygon
        //console.log(sides)
        const angle = (Math.PI * 2) / sides;
        const polygonSize = size / 2; // Radius of the polygon

        ctx.moveTo(
            this.x + polygonSize * Math.cos(0),
            this.y + polygonSize * Math.sin(0)
        );
        for (let i = 1; i <= sides; i++) {
            ctx.lineTo(
                this.x + polygonSize * Math.cos(angle * i),
                this.y + polygonSize * Math.sin(angle * i)
            );
        }
        ctx.closePath(); // Close the path
        ctx.fill(); // Fill the polygon
    }
}



	// flag - particle drawn or not
	keepInBoundaries(drawParticles) {
		let { x, y, size } = this;
        const { width, height } = this.canvas;

		// adjust to correct prev translating of particles to center when drawn or to 0 if not
		drawParticles ? (size /= 2) : (size = 0);
		if (x <= size || x >= width - size) {
			this.x = x <= size ? size : width - size;
			this.xSpeed *= -1;
		}

		if (y <= size || y >= height - size) {
			this.y = y <= size ? size : height - size;
			this.ySpeed *= -1;
		}
	}

	particlesCollision(particle, otherParticle, distance) {
		if (Math.abs(distance) < this.size) {
			[particle, otherParticle].forEach((p) => {
				p.xSpeed *= -1.001;
				p.ySpeed *= -1.001;
			});
		}
	}

	updateCoords(drawParticles) {
		this.size = this.size;
		this.keepInBoundaries(drawParticles);
		this.x += this.xSpeed;
		this.y += this.ySpeed;
	}

	updateSpeed(speed) {
		// rondomize speed and direction
		this.xSpeed = speed * (Math.random() * 2 - 1);
		this.ySpeed = speed * (Math.random() * 2 - 1);
	}

	// Inside Particle class
	handleMouseMove(event, mouseDistance) {
		if (!+mouseDistance) return; // need number here to use as bool!!!
		const mouseX = event.clientX;
		const mouseY = event.clientY;

		//console.log(mouseDistance,'listening for mouse')
		const { x, y } = this;
		let dx = mouseX - x;
		let dy = mouseY - y;

		const distance = Math.sqrt(dx * dx + dy * dy);

		if (distance && distance < mouseDistance) {
			dx /= distance;
			dy /= distance;
			// TODO remove moveAmount - go with px OR switch to using small int with higher miltilicator??
			const moveAmount = 2;
			this.x = x + dx * -moveAmount;
			this.y = y + dy * -moveAmount;
		}
	}
}