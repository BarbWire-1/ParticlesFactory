// TODO!!! colorPicker only shows new color when using hexCode (on proxy)
// TODO clean and clear this ugly thing!

//console.time('proxy')
// The proxy is used to keep data-object and interface values in sync
const proxies = new WeakMap(); // store new proxies to check for and re-use

// path and parent as parameters to have access through all levels
export const particlesProxy = (target, path = '', parent = target) => {
    // TODO change to setters in factory?
	const actions = {
		'main.numParticles': (value) => parent.updateNumParticles(value),
		'main.isFullScreen': () => parent.getCanvasSize(),

    };

	// get the path for nested objects
	const fullPath = (prop) => (path ? `${path}.${prop}` : prop);
	if (proxies.has(target)) {
		return proxies.get(target);// reuse existing proxies
	}

	const handler = {
		get(target, prop) {
			const value = target[prop];

			if (typeof value === 'object' && value !== null) {
				return particlesProxy(value, fullPath(prop), target); // recursion
			}
			return value;
		},

		set(target, prop, value) {
			target[prop] = value;
			bindInputElement(fullPath(prop), value);

			const actionCallback = actions[fullPath];
			if (actions[fullPath] && typeof actionCallback === 'function') {
				actionCallback(value); // call corresponding action callback if it exists
			}

			proxies.set(parent, proxy); // update the synchronized data in the proxies map
			return true;
		},
	};

	function initializeInputsSync(obj, currentPath = '') {
		for (const prop in obj) {
			const fullPath = currentPath ? `${currentPath}.${prop}` : prop;
			const value = obj[prop];

			//console.log(fullPath, value);

			if (fullPath.includes('canvas') || fullPath === 'getCanvasSize') {
				//console.log(`Excluded attribute: ${fullPath}`);
				continue;
			}

			if (typeof value === 'object' && value !== null) {
				const nestedObj = Array.isArray(value)
					? [...value]
					: { ...value }; // copy object or array to keep original
				initializeInputsSync(nestedObj, fullPath); // recurse
			} else {
				//console.log(fullPath, typeof fullPath)
				bindInputElement(fullPath, value); // Bind input values for properties
			}
		}
	}

	// Initialize input values on proxy creation
	initializeInputsSync(target, path);
	const proxy = new Proxy(target, handler);
	proxies.set(target, proxy); // Store newly created proxy in proxies
	return proxy;
};

function bindInputElement(path, value) {
	//console.log(path)
	const inputElement = document.querySelector(`[data-bind="${path}"]`);

	if (inputElement) {
		if (inputElement.type === 'checkbox') {
			inputElement.checked = value;
		} else {
			inputElement.value = +value || value;
		}
	} else {
		console.log(`No input found for ${path}`);
	}
}

//console.timeEnd('proxy')
