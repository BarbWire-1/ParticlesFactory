
import *  as particles from "../ParticlesFactory/index.js";
const {
    ParticlesFactory,
    handleEvents,
    particlesProxy } = particles;

// Initialisation
const options = {
  canvasId: "canvas", // required
    numParticles: 50,
  particleSize: 6,
  speed: 0.2,
  strokeColor: "#fff",
  fillColor: "#000",
  connectDistance: 150,
    mouseDistance: 100,
  particleColor: 'red'
};

const myParticles = new ParticlesFactory(options);

handleEvents(myParticles, "controlPanelContainer");

// for setting dynamically in JS use the particlesProxy
const proxy = particlesProxy(myParticles);
proxy.numParticles = 100;

//--------------------------------------------------------------------------------------------------
// unrelated, just to demonstrate how to use particlesFactory as background
document.getElementById("toggleContent").addEventListener("click", function () {
     const contentContainer = document.getElementById("content-container");
     contentContainer.classList.toggle("show");
});

function changeText() {
     const button = document.querySelector("#test-button");
     button.textContent = "Yeah, it clicked!";
     setTimeout(function () {
          button.textContent = "I'm listening :)";
     }, 1000);
}

document.addEventListener("DOMContentLoaded", function() {
    const button = document.querySelector("#test-button");
    button.addEventListener("click", changeText);
});
