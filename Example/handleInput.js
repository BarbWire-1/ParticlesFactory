// TODO make maps for properties and inputTypes?
// could become nicer to maintain but harder to read

export default function handleControl(el) {
	// event-delegation on controlPanelContainer
	const controlPanel = document.getElementById('controlPanelContainer');


    // EVENT - CALLBACKS
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
	}

    function handleButtonClick(e) {

		const id = e.target.id;
		const elements = {
			togglePanel: () => controlPanel.classList.toggle('open'),
			toggleAnimation: () => el.toggleAnimation(),
		};
		// call the corresponding function
		if (elements[id]) elements[id]();
	}


    // EVENT LISTENERS
    controlPanel.addEventListener('click', handleButtonClick);
	controlPanel.addEventListener('input', (event) => {
		const { id, value } = event.target;
		handleInputChange(el, id, value);
    });



    // for resposiveness
	// set relative width/height in CSS
	function resizeCanvas() {
		el.canvas.width = window.innerWidth;
		el.canvas.height = window.innerHeight;
		el.drawParticles();
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();// initial size-adjustment

}
