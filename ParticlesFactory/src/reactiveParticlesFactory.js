import { ParticlesFactory } from "./ParticlesFactory.js";




  export class ReactiveParticlesFactory extends ParticlesFactory {
    #particles;
      #createParticles;


    constructor(options) {
        super(options);
        this.#particles = this._getParticles;
        this.#createParticles = this._getCreateParticles

    }

    updateSpeed(value = this.main.speed) {
      this.#particles.forEach((p) => p.updateSpeed(value));
    }

    updateSpeed(value = this.main.speed) {
        const particles = this._getParticles(); // Access #particles using protected method
        particles.forEach((p) => p.updateSpeed(value));
        this._setParticles(particles); // Update #particles using protected method
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
