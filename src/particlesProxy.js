// Create a proxy on demand instead of having getters/setters per default
// add custom logic if necessary
export default function particlesProxy(el) {
  return new Proxy(el, {
    set(target, property, value) {
      target[property] = value;
      if (property === "numParticles" || property === "speed") {
        target.drawParticles();
      }
      return true;
    },
  });
}
