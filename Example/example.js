
import *  as particles from "../ParticlesFactory/index.js";
const {
    ParticlesFactory,
    handleEvents,
    particlesProxy } = particles;

// Initialisation
const options = {
  canvasId: "canvas", // required
    //   numParticles: 50, // all following optional
    //   particleSize: 6,
    //   speed: 0.2,
    //   strokeColor: "#4f4f4f",
    //   fillColor: "#000",
    //   connectDistance: 150,
    //   mouseDistance: 100,
    //   particleColor: '#E1FF00'

    //   isFullScreen: true,// flag to resize and redraw with window
    //   withParticles: false// flag to draw particles - if set to false lines only!
};

const myParticles = new ParticlesFactory(options);

handleEvents(myParticles, "controlPanelContainer");

// for setting dynamically in JS use the particlesProxy
const proxy = particlesProxy(myParticles);
proxy.numParticles = 100;

proxy.particles.size = 10

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
