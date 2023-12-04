// TODO change early returns into try/catch?

// The input-elements need to have a data-attribute = "particles-<path.to.attribute>"
// in order to get recognized and validated in here

export function handleInterfaceEvents(el, containerId) {
	// event-delegation on parent container
	const container = document.getElementById(containerId);

	// EVENT - CALLBACKS
	function handleInputChange(e) {
		const property = isValidAttribute(e, 'attribute');
		let value = e.target.value;

		if (e.target.type === 'checkbox') {
			value = e.target.checked;
		} else {
			value = +value || value;
		}

		// attributes which require recalculations
		const updates = {
			numParticles: () => el.setNumParticles(value),
            speed: () => el.setSpeed(),
            //size:() => el.setParticlesSize(),
			isFullScreen: () => el.getCanvasSize(),
		};

		if (property.includes('.')) {
			const path = property.split('.');
			if (!el[path[0]]) return; // IF particles or lines are not defined eg

			el[path[0]][path[1]] = value;
			if (updates[path[1]]) updates[path[1]]();
		} else {
			el[property] = value;
		}
	}

	function isValidAttribute(e, type) {
		const dataAttribute = e.target.dataset?.[type]?.split('-');
		// search for input with corresponding data-attribute
		if (!dataAttribute || dataAttribute[0] !== 'particles') return;
		const path = dataAttribute[1];
		return path;
	}

	function handleButtonClick(e) {
		//console.log(e.target)
		const dataAction = isValidAttribute(e, 'action');

		// for control-sidebar in example - could be customised, perhaps pass from main???
		const clickAction = {
			togglePanel: () => container.classList.toggle('open'),
			toggleAnimation: () => el.toggleAnimation(),
			toggleVisibility: () =>
				e.target.nextElementSibling.classList.toggle('collapsed'),
			// add more callbacks here if needed
		};

		if (clickAction[dataAction]) clickAction[dataAction]();
	}

	// EVENT LISTENERS
	container.addEventListener('click', handleButtonClick);
	container.addEventListener('input', handleInputChange);
}