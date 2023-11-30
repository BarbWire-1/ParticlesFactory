
// TODO!!! colorPicker only shows new color when using hexCode (on proxy)

// calling methods on parent not working!!!
const proxies = new WeakMap(); // store new proxies to check for and re-use


// path and parent as parameters to have access through all levels
export const particlesProxy = (target, path = '', parent = target) => {
    if (proxies.has(target)) {
        return proxies.get(target); // reuse existing proxy
    }

    const handler = {
        get(target, prop) {
            const value = target[prop];
            if (typeof value === 'object' && value !== null) {
                const childPath = path ? `${path}.${prop}` : prop;
                return particlesProxy(value, childPath, target); // Pass the current target as the parent for the sub-object
            }
            return value;
        },
        set(target, prop, value) {

            console.log(parent)
            target[prop] = value;
            const fullPath = path ? `${path}.${prop}` : prop;
            bindInputElement(fullPath, value);
            console.log(fullPath)
            if (fullPath === 'main.numParticles' && parent && typeof parent.updateNumParticles === 'function') {
                console.log(parent +'should update')
               parent.updateNumParticles(value);
            }

            if (fullPath === 'main.isFullScreen' ) {
                console.log('Should resize')
                parent.resizeCanvas();
            }
            return true;
        },
    };

    const proxy = new Proxy(target, handler);
    proxies.set(target, proxy); // store newly created proxy in proxies
    return proxy;
};


function bindInputElement(path, value) {
     console.log(path)
	//path = path.slice(1)
	const inputElement = document.querySelector(
        `[data-attribute="particles-${path}"]`

	);
	//console.log(inputElement);
	if (inputElement && value) {
		inputElement.value = value;
		//console.log(typeof value, value);
	} else {
		console.log(`No input found for ${path}`);
	}
}
