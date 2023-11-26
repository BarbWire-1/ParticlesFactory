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
		let value = e.target.value;

		if (e.target.type === 'checkbox') {
			value = e.target.checked;
		} else {
			value = +value || value || e.target.checked;
        };

        if (property.includes('.')) { // get the objects
            const prop = property.split('.');
            el[ prop[ 0 ] ][ prop[ 1 ] ] = value
            console.log(prop)
        } else {
            console.log(property)
            el[property] = value;
        };


		if (
			property === 'numParticles' ||
			property === 'speed' || // TODO instead redraw just update speed of particles?
			property === 'particles.size' // this too
        ) {
          console.log(el.particles.size)
			el.createParticles();
        };
		// Additional logic for other properties...
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
}
