import {offscreenCanvas} from './ParticlesFactory.js'
export function handleEvents(el, containerId) {
	// event-delegation on parent container
	const container = document.getElementById(containerId);

	// EVENT - CALLBACKS
	/**
	 *
	 * @param {*} el The particles instance
	 * @param {*} attribute The value of the data-attribute of the target input element
	 * @param {*} value The recieved value to apply to the el's attribute of same name
	 */

	function handleInputChange(e) {
		const property = isValidAttribute(e, 'attribute');
		const value = e.target.value;
		el[property] = +value || value;
        if (property === 'numParticles'
            || property === 'speed'
            || property === 'particlesSize')
			el.createParticles();
	}

	function isValidAttribute(e, type) {
		const dataAttribute = e.target.dataset?.[type]?.split('-');
		if (!dataAttribute || dataAttribute[0] !== 'particles') return;
		return dataAttribute[1];
	}

	function handleButtonClick(e) {
		const dataAction = isValidAttribute(e, 'action');
		// for control-sidebar in example - could be customised, perhaps pass from main???
		const clickAction = {
			togglePanel: () => container.classList.toggle('open'),
			toggleAnimation: () => el.toggleAnimation(),
			// add more callbacks here if needed
		};

		if (clickAction[dataAction]) clickAction[dataAction]();
	}

	// EVENT LISTENERS
	container.addEventListener('click', handleButtonClick);
	container.addEventListener('input', handleInputChange);


    // TODO move this to factory (then remove import)  - add a flag for isResponsive
	// for resposiveness - redraws canvas on resize
	function resizeCanvas() {
		el.canvas.width = offscreenCanvas.width = window.innerWidth;
		el.canvas.height = offscreenCanvas.height = window.innerHeight;
		el.createParticles();
	}

	window.addEventListener('resize', resizeCanvas);
	resizeCanvas(); // initial size-adjustment
}
