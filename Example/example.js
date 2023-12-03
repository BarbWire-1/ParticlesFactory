import {
	ParticlesFactory,
	handleInterfaceEvents,
	particlesProxy,
} from '../ParticlesFactory/index.js';

// Initialisation
const options = {
	canvas: {
		id: 'my-particles',
		 width: 500,
		 height: 500,
		// fillStyle: '#000',
	},
	main: {
		numParticles: 200,
		speed: 0.2,
		mouseDistance: 100,
		isFullScreen: true,
		isResponsive: true, // whether to recalculate x,y of particles on resize
	},
	particles: { fillStyle: '#E1FF00', size: 5, draw: true, collision: true }, // optional - with defaults if only "particles"
	lines: { connectDistance: 100, strokeStyle: '#4f4f4f', draw: true }, // optional - with defaults if only "lines"
};

const myParticles = new ParticlesFactory(options);

handleInterfaceEvents(myParticles, 'controlPanelContainer');

// for setting dynamically in JS to update corresponding input use the proxy
const proxy = particlesProxy(myParticles);
// proxy.numParticles = 30;
//
//
// proxy.lines.strokeStyle = "#ff0000"// ok
// proxy.particles.fillStyle = 'blue'// applied at target but input needs hex to understand
proxy.particles.fillStyle = '#0000ff';
proxy.lines.strokeStyle = '#8F5219';
// proxy.particles.size = 5;// ok
// proxy.particles.draw = false;// ok
//--------------------------------------------------------------------------------------------------
// unrelated, just to demonstrate how to use particlesFactory as background
document.getElementById('toggleContent').addEventListener('click', function () {
	const contentContainer = document.getElementById('content-container');
	contentContainer.classList.toggle('show');
});

function changeText() {
	const button = document.querySelector('#test-button');
	button.textContent = 'Yeah, it clicked!';
	setTimeout(function () {
		button.textContent = "I'm listening :)";
	}, 1000);
}

document.addEventListener('DOMContentLoaded', function () {
	const button = document.querySelector('#test-button');
	button.addEventListener('click', changeText);
});

// myParticles.updateNumParticles(500)
// myParticles.updateSpeed(1);
// myParticles.particles.size = 20;
 //proxy.main.numParticles = 50;

//myParticles.canvas.width = myParticles.canvas.height = 500
//myParticles.main.isFullScreen = false


// PROXY  and HANDLEINPUT ONLY necessary if using inputs
