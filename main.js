import {
    handleInterfaceEvents,
    particlesProxy,
} from './src/ParticlesInterfaceHandler/index.js';

// instantiate 
(function createExample() {
    // downloaded config from https://particles-factory.netlify.app/ after having changed the settings
    const options = {
        "canvas": {
            "id": "my-particles",
            "width": 500,
            "height": 500
        },
        "main": {
            "frameRate": 40,
            "numParticles": 100,
            "speed": 1,
            "mouseDistance": 100,
            "fillStyle": "#000",
            "isFullScreen": true,
            "isResponsive": true
        },
        "particles": {
            "shape": "circle",
            "fillStyle": "#ff0000",
            "randomFill": true,
            "noFill": false,
            "stroke": false,
            "size": 24,
            "randomSize": true,
            "draw": true,
            "collision": true,
            "opacity": 1
        },
        "lines": {
            "connectDistance": 150,
            "strokeStyle": "#f7f7f7",
            "draw": true,
            "lineWidth": 1,
            "opacity": 0.7
        },
        "numParticles": 50
    }

    const myParticles = new ParticlesFactory(options);

    // the settings-interface
    handleInterfaceEvents(myParticles, 'controlPanelContainer');
    const proxy = particlesProxy(myParticles);

    // unrelated, just to demonstrate how to use particlesFactory as background
    document.getElementById('toggleContent').addEventListener('click', function () {
        const contentContainer = document.getElementById('content-container');
        contentContainer.classList.toggle('show');
    });
    function changeText() {
        const button = document.querySelector('#test-button');
        button.textContent = 'Yeah, it clicked!';
        setTimeout(function () {
            button.textContent = "I'm listening :)";
        }, 1000);
    }
    document.addEventListener('DOMContentLoaded', function () {
        const button = document.querySelector('#test-button');
        button.addEventListener('click', changeText);
    });

    downloadButton.addEventListener('click', () => {

        myParticles.savePropsStatus2File()
    });

})();