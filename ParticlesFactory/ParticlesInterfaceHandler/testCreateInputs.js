// Function to create and append elements based on properties
//TODO create an object for the individual input-settings?

//TODO change this to the adjustments, add class ... and then decide
export function createElementsFromProperties(obj, targetElId) {
    console.log(obj)
	const properties = Object.getOwnPropertyNames(obj);

    const fragment = document.createDocumentFragment();
    const targetElement = document.getElementById(targetElId);

	properties.forEach((prop) => {
		if (
			!prop.startsWith('canvas') &&
			typeof obj[prop] !== 'function'
		) {
			const sectionHeader = document.createElement('h3');
			sectionHeader.setAttribute(
				'data-bind',
				'particles-toggleVisibility'
			);
			sectionHeader.textContent = `▶ ${prop}`;
			fragment.appendChild(sectionHeader);

			const inputContainer = document.createElement('div');
			inputContainer.classList.add('inputContainer');

			const propValue = obj[prop];
			if (typeof propValue === 'object') {
				for (const innerProp in propValue) {
					const value = propValue[innerProp];
					const labelSettings = {
						for: innerProp,
						textContent:
							typeof value !== 'boolean'
								? `${innerProp}:`
								: innerProp,
					};
					const inputSettings = {
						id: innerProp,
						'data-bind': `${prop}.${innerProp}`,
						type:
							typeof value === 'boolean'
								? 'checkbox'
								: typeof value === 'string' &&
								  value.startsWith('#')
								? 'color'
								: 'number',
						value: value,
						...(typeof value !== 'boolean' && {
							min: '0',
							max: '100',
						}), // Only apply min/max for number inputs - would need to specify.
						...(typeof value === 'boolean' && { checked: value }), // Check the checkbox if it's a boolean value
					};

					const label = document.createElement('label');
					Object.keys(labelSettings).forEach((key) => {
						label[key] = labelSettings[key];
					});
					inputContainer.appendChild(label);

					if (typeof value === 'boolean') {
						const checkboxContainer = document.createElement('div');
						checkboxContainer.classList.add('checkbox-container');

						const input = document.createElement('input');
						Object.keys(inputSettings).forEach((key) => {
							input[key] = inputSettings[key];
						});
						checkboxContainer.appendChild(input);
						inputContainer.appendChild(checkboxContainer);
					} else {
						const input = document.createElement('input');
						Object.keys(inputSettings).forEach((key) => {
							input[key] = inputSettings[key];
						});
						inputContainer.appendChild(input);

						if (typeof value !== 'boolean') {
							const lineBreak = document.createElement('br');
							inputContainer.appendChild(lineBreak);
						}
					}
				}
			}

			fragment.appendChild(inputContainer);

			const hr = document.createElement('hr');
			fragment.appendChild(hr);
		}
	});

	// Append the generated HTML to a target element

// console.log(targetElement);
if (targetElement) {

	targetElement.appendChild(fragment);
}
}


//second variant using innerHTML - "easier" to directly add the necessary settings to the inputs
//TEST -create inputs dynamically
// get all props not starting with canvas... then create the input-structure
function generateHTMLFromProperties() {
	const properties = Object.getOwnPropertyNames(myParticles);

	let generatedHTML = '';

	properties.forEach((prop) => {
		if (
			!prop.startsWith('canvas') &&
			typeof myParticles[prop] !== 'function'
		) {
			generatedHTML += `<h3 data-action="particles-toggleVisibility">▶ ${prop}</h3>`;
			generatedHTML += '<div class="inputContainer">';

			const propValue = myParticles[prop];
			if (typeof propValue === 'object') {
				for (const innerProp in propValue) {
					const value = propValue[innerProp];
					if (typeof value !== 'boolean') {
						generatedHTML += `<label for="${innerProp}">${innerProp}:</label>`;
					}

					if (typeof value === 'boolean') {
						generatedHTML += `<div class="checkbox-container">
                                <label for="${innerProp}">${innerProp}</label>
                                <input id="${innerProp}" data-attribute="particles-${prop}.${innerProp}" type="checkbox" ${
									value ? 'checked' : ''
								}>
                              </div>`;
					} else if (
						typeof value === 'string' &&
						value.startsWith('#')
					) {
						generatedHTML += `<input id="${innerProp}" data-attribute="particles-${prop}.${innerProp}" type="color" value="${value}">`;
					} else {
						generatedHTML += `<input id="${innerProp}" data-attribute="particles-${prop}.${innerProp}" type="number" value="${value}" min="0" max="100">`;
					}

					if (typeof value !== 'boolean') {
						generatedHTML += '<br>';
					}
				}
			}

			generatedHTML += '</div>';
			generatedHTML += '<hr>';
		}
	});

	return generatedHTML;
}
