import { ParticlesFactory, handleEvents, particlesProxy } from "../ParticlesFactory/index.js";

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

const myParticles = new ParticlesFactory(options);

handleEvents(myParticles, "controlPanelContainer");

// for setting dynamically in JS use the particlesProxy
const proxy = particlesProxy(myParticles);
proxy.numParticles = 150;
