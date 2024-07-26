

// The input-elements need to have a data-bind = "<path.to.attribute>" like data-bind="main.numParticles"
// in order to get recognized and validated in here
//The buttons calling an action currently have data-action = "functionName"
//console.time('handler')

export function handleInterfaceEvents(el, containerId) {

	const container = document.getElementById(containerId);

	// EVENT - CALLBACKS
	function handleInputChange(e) {
		const property = isValidAttribute(e, 'bind');
		let value = e.target.value;

		if (e.target.type === 'checkbox') {
			value = e.target.checked;
		} else {
			value = +value || value;
		}

		// attributes which require recalculations
		const updates = {
			numParticles: () => el.setNumParticles(value),
			speed: () => el.setSpeed(value),
			size: () => {
				if (el.particles.randomSize) el.setBaseSize(+value);
            },
            isFullScreen: () => el.getCanvasSize(),

		};

		if (property.includes('.')) {
			const path = property.split('.');
			if (!el[path[0]]) return; // IF particles or lines are not defined eg

			el[path[0]][path[1]] = value;
            if (updates[ path[ 1 ] ]) updates[ path[ 1 ] ]();// call the update function if it exists
		} else {
			el[property] = value;
		}
	}

	function isValidAttribute(e, type) {
        const dataAttribute = e.target.dataset?.[ type ]//?.split('-');

		// search for input with corresponding data-attribute
		if (!dataAttribute) return;
		const path = dataAttribute//[1];
		return path;
	}


	function toggleVisibility(e) {
		const nextElement = e.target.nextElementSibling;
		const isVisible = nextElement.classList.contains('visible');

		// close any currently collapsed elements
		const collapsedElements = document.querySelectorAll('.visible');

		collapsedElements.forEach((element) => {
			if (element !== nextElement) {
				element.classList.remove('visible');
			}
		});

		// toggle visibility
		nextElement.classList.toggle('visible', !isVisible);
	}

	function handleButtonClick(e) {
		//console.log(e.target)
		const dataAction = isValidAttribute(e, 'action');

		// for control-sidebar in example - could be customised, perhaps pass from main???
		const clickAction = {
			togglePanel: () => container.classList.toggle('open'),
			toggleAnimation: () => el.toggleAnimation(),
			toggleVisibility: () => toggleVisibility(e),

		};

		if (clickAction[dataAction]) clickAction[dataAction]();
    }




	// EVENT LISTENERS
	container.addEventListener('click', handleButtonClick);
	container.addEventListener('input', handleInputChange);
}
//console.timeEnd('handler')
