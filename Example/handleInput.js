export default function handleControl(el) {
	// switch on id: generalise with sliced string?
	function handleInputChange(el, id, value) {
		switch (id) {
			case 'numParticlesInput':
				el.numParticles = +value;
				el.drawParticles();
				break;
			case 'speedInput':
				el.speed = +value;
				// el.particles.map(p => p.speed += el.speed)
				//TODO change this inside draw()to update existing particles' speed!!!
				el.drawParticles();
				break;
			case 'strokeColorInput':
				el.strokeColor = value;
				break;
			case 'fillColorInput':
				el.fillColor = value;
				break;
			case 'connectDistanceInput':
				el.connectDistance = +value;
				break;
			case 'mouseDistanceInput':
				el._mouseDistance = +value;
				break;
			default:
				break;
		}

		// el.drawParticles();
	}

	// event-delegation on controlPanelContainer
	const controlPanel = document.getElementById('controlPanelContainer');

	controlPanel.addEventListener('input', (event) => {
		const { id, value } = event.target;
		handleInputChange(el, id, value);
	});

	const togglePanel = document.getElementById('togglePanel');

	togglePanel.addEventListener('click', () => {
		controlPanel.classList.toggle('open');
	});

	// Get the button element
	const toggleAnimation = document.getElementById('toggleAnimation');

	toggleAnimation.addEventListener('click', () => {
		el.toggleAnimation();
	});

	// for full-screen canvas
	function resizeCanvas() {
		el.canvas.width = window.innerWidth;
		el.canvas.height = window.innerHeight;
		el.drawParticles();
	}

	resizeCanvas();
	window.addEventListener('resize', resizeCanvas);
}
