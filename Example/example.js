
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
        numParticles: 100,
        speed: 0.2,
        mouseDistance: 100,
        isFullScreen: true,
        reposition: true// whether to recalculate x,y of particles on resize
    },
    particles: { fillStyle: '#E1FF00', size: 2 , draw: true, collision: true},// optional - with defaults if only "particles"
    lines: { connectDistance: 100, strokeStyle:'#4f4f4f', draw: true },// optional - with defaults if only "lines"

}


const myParticles = new ParticlesFactory(options);

handleEvents(myParticles, "controlPanelContainer");

// for setting dynamically in JS to update corresponding input use the proxy
const proxy = particlesProxy(myParticles);
// proxy.numParticles = 30;
//
//
// proxy.lines.strokeStyle = "#ff0000"// ok
// proxy.particles.fillStyle = 'blue'// applied at target but input needs hex to understand
// proxy.particles.size = 5;// ok
// proxy.particles.draw = false;// ok
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


myParticles.updateNumParticles(400); // TODO rather add a getter setter for main.numParticles??

console.log(myParticles
)