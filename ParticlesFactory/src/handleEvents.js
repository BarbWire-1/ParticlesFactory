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

	function handleInputChange(el, attribute, value) {
		el[attribute] = +value || value;
		if (attribute === 'numParticles' || attribute === 'speed')
			el.createParticles();
	}

	function isValidAttribute(e, type) {
		const dataAttribute = e.target.dataset?.[type]?.split('-');
		if (!dataAttribute || dataAttribute[0] !== 'particles') return;
		return dataAttribute[1];
	}

	function handleButtonClick(e) {
		const dataAction = isValidAttribute(e, 'action');
		const clickAction = {
			togglePanel: () => container.classList.toggle('open'),
			toggleAnimation: () => el.toggleAnimation(),
			// add more callbacks here if needed
		};

		if (clickAction[dataAction]) clickAction[dataAction]();
	}

	// EVENT LISTENERS
	container.addEventListener('click', handleButtonClick);
	container.addEventListener('input', (e) => {
		const dataAttribute = isValidAttribute(e, 'attribute');
		const value = e.target.value;

		handleInputChange(el, dataAttribute, value);
	});

	// for resposiveness - redraws canvas on resize
	function resizeCanvas() {
		el.canvas.width = window.innerWidth;
		el.canvas.height = window.innerHeight;
		el.createParticles();
	}

	window.addEventListener('resize', resizeCanvas);
	resizeCanvas(); // initial size-adjustment
}
