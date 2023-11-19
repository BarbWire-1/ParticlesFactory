import ParticlesFactory from "../src/ParticlesFactory.js";

// Initialisation
const options = {
  canvasId: "canvas", // required
  numParticles: 200,
  speed: 0.2,
  strokeColor: "#fff",
  fillColor: "#000",
  connectDistance: 150,
  mouseDistance: 100,
};

export const myParticles = new ParticlesFactory(options);
