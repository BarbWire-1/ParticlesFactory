/**
 * Creates a proxy for a ParticlesFactory instance to handle double-data-binding and trigger updates.
 *
 * @param {ParticlesFactory} el - ParticlesFactory instance
 * @returns {Proxy} - A proxy object for the ParticlesFactory instance
 */

export function particlesProxy(el) {
	return new Proxy(el, {
		/**
		 *  property assignment and trigger updates for 'numParticles' and 'speed'.
		 *
		 * @param {ParticlesFactory} target - ParticlesFactory instance.
		 * @param {string} property - The property being set.
		 * @param {*} value - The value being assigned to the property.
		 * @returns {boolean} - Returns true for successfully set.
		 */

        set(target, property, value) {
        console.log(Object.keys(target))
            console.log(target, property, value)
			target[property] = value;
            updateInputValue(target, property);
			if (property === 'numParticles' || property === 'speed' ) {
				target.createParticles();

			}
			return true;
        },

	});
}

/**
 * Updates the value of the corresponding input element based on the attribute of the ParticlesFactory instance.
 *
 * @param {ParticlesFactory} el - ParticlesFactory instance.
 * @param {string} attribute - attributeName to be updated.
 * @returns {void}
 */

function updateInputValue(el, attribute) {
    console.log( attribute)
	const input = document.querySelector(
		`input[data-attribute="particles-${attribute}"]`
	);
	if (!input) return;

	input.value = el[attribute];
}
