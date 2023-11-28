import { ParticlesFactory } from "./ParticlesFactory.js";

//TODO how to achieve access to #createParticles?
// add a getter in parentClass?


  export class ReactiveParticlesFactory extends ParticlesFactory {
    #particles;
    #createParticles;


    constructor(options) {
        super(options);
        this.#particles = []


    }

    updateSpeed(value = this.main.speed) {
      this.#particles.forEach((p) => p.updateSpeed(value));
    }



    updateNumParticles(newValue) {
      const currentCount = this.#particles.length;
      const difference = newValue - currentCount;

      if (newValue && difference && difference > 0) {
        this.addParticles(difference);
      } else if (difference < 0) {
        this.removeParticles(currentCount, -difference);
      }

      this.main.numParticles = this.#particles.length;
    }

    addParticles(difference) {
      //console.log(`add ${difference} particles`)
      this.#createParticles(difference);
    }

    removeParticles(currentCount, difference) {
      console.log(difference);
      this.#particles.splice(currentCount - difference, difference);
      this.main.numParticles = this.#particles.length;
    }
  }
