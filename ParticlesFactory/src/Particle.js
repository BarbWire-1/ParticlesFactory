export class Particle {
	constructor(x, y, size, speed) {
		this.x = x;
		this.y = y;
		this.size = size;
		// rondomize speed and direction
		this.xSpeed = speed * (Math.random() * 2 - 1);
		this.ySpeed = speed * (Math.random() * 2 - 1);
	}

	draw(ctx, fillColor) {
        ctx.fillStyle = fillColor;
        // center the particle on point;
        let cx = this.x - this.size / 2;
        let cy = this.y - this.size / 2;

		ctx.fillRect(cx, cy, this.size, this.size);
	}
    // here only boundaries
	collisionDetection() {
        let { x, y, size} = this;
		const { width, height } = canvas;

		if (x <= size || x >= width - size) {
			this.x = x <= size ? size : width - size;
			this.xSpeed *= -1;
		}

		if (y <= size || y >= height - size) {
			this.y = y <= size ? size : height - size;
			this.ySpeed *= -1;
		}
	}

    update() {
        this.size = this.size;
		this.collisionDetection();
		this.x += this.xSpeed;
		this.y += this.ySpeed;
	}
}
