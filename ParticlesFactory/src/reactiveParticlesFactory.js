import { ParticlesFactory } from './ParticlesFactory.js';
import { Particle } from './Particle.js';

//TODO how to achieve access to #createParticles?
// add a getter in parentClass?
// really HATE the system of (not)inheritance in here !!!!!!!!!!!!!

export class ReactiveParticlesFactory extends ParticlesFactory {
	#particles;

	constructor(options) {
		super(options);
		this.#particles = [];
	}

	updateSpeed(value = this.main.speed) {
		this.#particles.forEach((p) => p.updateSpeed(value));
	}

	updateNumParticles(newValue) {

		const currentCount = this.#particles.length;
		const difference = newValue - currentCount;

		if (newValue && difference && difference > 0) {
			this.#addParticles(difference);
		} else if (difference < 0) {
			this.#removeParticles(currentCount, -difference);
		}

		this.main.numParticles = this.#particles.length;
	}

	#addParticles(difference) {
		console.log(`add ${difference} particles`);
		this.createParticles(difference); // is not a function (???)
	}

	#removeParticles(currentCount, difference) {
		console.log(difference);
		this.#particles.splice(currentCount - difference, difference);
		this.main.numParticles = this.#particles.length;
	}
}

//TODO this is so stupid:

class Parent {
	#privateMethod() {
		console.log('Private method from Parent');
	}

	publicMethod() {
		console.log('Public method from Parent');
		this.#privateMethod(); // Access private method within the class
	}
}

class Child extends Parent {
	childMethod() {
		this.publicMethod(); // expose the initially private method on child
		// Cannot directly access #privateMethod here
	}
}

const child = new Child();
//child.childMethod(); // This will invoke publicMethod, which indirectly accesses #privateMethod - but it is EXPOSED
