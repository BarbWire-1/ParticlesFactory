import { ParticlesFactory } from "./ParticlesFactory.js";
import { Particle } from "./Particle.js";

//TODO how to achieve access to #createParticles?
// add a getter in parentClass?


  export class ReactiveParticlesFactory extends ParticlesFactory {
    #particles;



    constructor(options) {
        super(options);
        this.#particles = []


    }

    updateSpeed(value = this.main.speed) {
      this.#particles.forEach((p) => p.updateSpeed(value));
    }



      updateNumParticles(newValue) {
          console.log({ newValue })
          const currentCount = this.#particles.length;
          console.log({currentCount})
      const difference = newValue - currentCount;

      if (newValue && difference && difference > 0) {
        this.#addParticles(difference);
      } else if (difference < 0) {
        this.#removeParticles(currentCount, -difference);
      }

      this.main.numParticles = this.#particles.length;
    }

    #addParticles(difference) {
      console.log(`add ${difference} particles`)
      this.#createParticles(difference);
    }

    #removeParticles(currentCount, difference) {
      console.log(difference);
      this.#particles.splice(currentCount - difference, difference);
      this.main.numParticles = this.#particles.length;
    }





      // initial creation
    #createParticles(count = this.main.numParticles) {
         console.log("count from #createParticles: " + count)
        // console.log(this.main.numParticles)
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

            console.log(this.#particles)// created but not drawn!
		}
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
child.childMethod(); // This will invoke publicMethod, which indirectly accesses #privateMethod - but it is EXPOSED 
