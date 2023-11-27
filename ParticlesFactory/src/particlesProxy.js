
// TODO!!! colorPicker only shows new color when using hexCode (on proxy)
const proxies = new WeakMap(); // store new proxies to check for and re-use
export const particlesProxy = (target, path = '') => {
	if (proxies.has(target)) {
		//console.log(`has target: ${JSON.stringify(target)}`)
		//const storedProxy = proxies.get(target); // to check for existing proxies
		//console.log({storedProxy}); // needs to be destructured!!!!!!! else {}
		return proxies.get(target); // reuse existing proxy
	}

	const handler = {
		get(target, prop) {
			const value = target[prop];
			if (typeof value === 'object' && value !== null) {
				const childPath = path ? `${path}.${prop}` : prop;
				return particlesProxy(value, childPath);
			}
			//console.log(`Accessing property '${prop}'`);
			return value;
		},
		set(target, prop, value) {
			//console.log(`Setting property '${prop}' to '${value}'`);
			target[prop] = value;
			const fullPath = path ? `${path}.${prop}` : prop;
			bindInputElement(fullPath, value);
			//console.log(fullPath);
			if (fullPath === 'numParticles') target.createParticles();
			return true;
		},
	};

	const proxy = new Proxy(target, handler);
	//console.log({ proxy });
	proxies.set(target, proxy); // store newly created proxies in proxies

	return proxy;
};

function bindInputElement(path, value) {
	//path = path.slice(1)
	const inputElement = document.querySelector(
		`[data-attribute="particles-${path}"]`
	);
	console.log(inputElement);
	if (inputElement && value) {
		inputElement.value = value;
		//console.log(typeof value, value);
	} else {
		console.log(`No input found for ${path}`);
	}
}
