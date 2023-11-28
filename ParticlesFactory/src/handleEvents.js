//TODO add el-name to path in data-attributes?

export function handleEvents(el, containerId) {
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
			numParticles:() => el.updateNumParticles(value),
			speed:()=> el.updateSpeed(),
        };

		if (property.includes('.')) {

			const path = property.split('.');
            el[ path[ 0 ] ][ path[ 1 ] ] = value;

			if (updates[path[1]]) updates[path[1]]();

		} else {
			el[property] = value;
		}
	}

	function isValidAttribute(e, type) {
		const dataAttribute = e.target.dataset?.[type]?.split('-');
		// search for input with corresponding data-attribute
		if (!dataAttribute || dataAttribute[0] !== 'particles') return;
		// path to attribute
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
}
