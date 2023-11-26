/**
 * Creates a proxy for a ParticlesFactory instance to handle double-data-binding and trigger updates.
 *
 * @param {ParticlesFactory} el - ParticlesFactory instance
 * @returns {Proxy} - A proxy object for the ParticlesFactory instance
 */
// TODO!:!:! Look up recursive proxy!
export function createNestedProxies(obj, handler = {}) {
    const proxyCache = new WeakMap();

    return new Proxy(obj, {
        get(target, prop, receiver) {
            const value = Reflect.get(target, prop, receiver);
            //console.log(value)
            if (typeof value === 'object' && value !== null) {
                if (!proxyCache.has(value)) {
                    const proxy = new Proxy(value, handler);
                    //console.log(proxy)
                    proxyCache.set(value, proxy);
                }
                return proxyCache.get(value);
            }

            return value;
        },
        set(target, prop, value, receiver) {
            const result = Reflect.set(target, prop, value, receiver);
            console.log(prop, value, target)
            if (result) {
                console.log(`Set ${prop} to ${value} in`, target);
                updateInputValue(target, prop);
            }
            return result;
        },
    });
    console.log(proxyCache)
}




/**
 * Updates the value of the corresponding input element based on the attribute of the ParticlesFactory instance.
 *
 * @param {ParticlesFactory} el - ParticlesFactory instance.
 * @param {string} attribute - attributeName to be updated.
 * @returns {void}
 */

function updateInputValue(el, attribute) {
    console.log(attribute)
    const [mainAttr, nestedAttr] = attribute.split('.');

    const input = document.querySelector(
        `input[data-attribute="particles-${mainAttr}"][data-nested-attribute="${nestedAttr}"]`
    );

    if (!input) return;

    if (nestedAttr) {
        input.value = el[mainAttr][nestedAttr];
    } else {
        input.value = el[attribute];
    }
}
