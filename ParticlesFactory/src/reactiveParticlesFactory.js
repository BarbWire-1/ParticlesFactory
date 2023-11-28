import { ParticlesFactory } from "./ParticlesFactory.js";




  export class ReactiveParticlesFactory extends ParticlesFactory {
    #particles;
    #createParticles;

    constructor() {
      super();

    }

    updateSpeed(value = el.main.speed) {
      this.#particles.forEach((p) => p.updateSpeed(value));
    }

    updatePosition() {
      this.#particles.forEach((p) =>
        p.updatePosition(el.canvas, window.innerWidth, window.innerHeight)
      );
    }

    updateNumParticles(newValue) {
      const currentCount = this.#particles.length;
      const difference = newValue - currentCount;

      if (newValue && difference && difference > 0) {
        this.addParticles(difference);
      } else if (difference < 0) {
        this.removeParticles(currentCount, -difference);
      }

      el.main.numParticles = this.#particles.length;
    }

    addParticles(difference) {
      //console.log(`add ${difference} particles`)
      this.#createParticles(difference);
    }

    removeParticles(currentCount, difference) {
      console.log(difference);
      this.#particles.splice(currentCount - difference, difference);
      el.main.numParticles = this.#particles.length;
    }
  }
