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
            value = +value || value ;
        };

        if (property.includes('.')) { // get the objects
            const path = property.split('.');
            el[ path[ 0 ] ][ path[ 1 ] ] = value;

        } else {
            el[ property ] = value;
        };


        if (
            property === 'main.numParticles'

        ) {

            el.updateNumParticles(value);
        } else if (property === 'main.speed') {
            el.updateSpeed()
        };

    }


    function isValidAttribute(e, type) {

        const dataAttribute = e.target.dataset?.[ type ]?.split('-');
        // search for input with corresponding data-attribute
        if (!dataAttribute || dataAttribute[ 0 ] !== 'particles') return;
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
