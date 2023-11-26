
import *  as particles from "../ParticlesFactory/index.js";
const {
    ParticlesFactory,
    handleEvents,
    particlesProxy } = particles;

// Initialisation
const options = {
    main:  {
        canvasId: 'canvas',
        bgColor: '#000',
        numParticles: 500,
        //particlesSize = 2,
        speed: 0.2,
        mouseDistance: 100,
        isFullScreen: true,
    },
    particles: { fillStyle: '#E1FF00', size: 2 },
    lines: { connectDistance: 100, strokeStyle:'#4f4f4f' },

    withParticles: true,
    particlesCollision: true,
    withLines: true,
}


const myParticles = new ParticlesFactory(options);

handleEvents(myParticles, "controlPanelContainer");

// for setting dynamically in JS use the particlesProxy
const proxy = particlesProxy(myParticles);
proxy.numParticles = 100;

//proxy.particles.size = 2// CHECK PROXY!!!!!

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
