import {
	ParticlesFactory,
	handleInterfaceEvents,
    particlesProxy,

} from '../ParticlesFactory/index.js';


export default (function createExample() {

    // downloaded config from https://particles-factory.netlify.app/ after having changed the settings
    const options = {
    "canvas": {
        "id": "my-particles",
        "width": 500,
        "height": 500
    },
    "main": {
        "frameRate": 17,
        "numParticles": 400,
        "speed": 0.5,
        "mouseDistance": 100,
        "fillStyle": "#000",
        "isFullScreen": true,
        "isResponsive": true
    },
    "particles": {
        "shape": "square",
        "fillStyle": "#ff0000",
        "randomFill": false,
        "noFill": false,
        "stroke": false,
        "size": 8,
        "randomSize": false,
        "draw": true,
        "collision": false,
        "opacity": 0.7
    },
    "lines": {
        "connectDistance": 80,
        "strokeStyle": "#f7f7f7",
        "draw": true,
        "lineWidth": 1,
        "opacity": 0.5
    },
    "numParticles": 4
}

    const myParticles = new ParticlesFactory(options);

    handleInterfaceEvents(myParticles, 'controlPanelContainer');

    // for setting dynamically in JS to update corresponding input use the proxy
    const proxy = particlesProxy(myParticles);
    //createElementsFromProperties(myParticles, 'inputSection')

    //console.log(proxy.main.numParticles)
    //console.log(myParticles.main.numParticles)
    //proxy.main.numParticles = 30;// set on proxy updates input el
    //
    //
    // proxy.lines.strokeStyle = "#ff0000"// ok
    // //proxy.particles.fillStyle = 'blue'// applied at target but input needs hex to understand
    // proxy.particles.randomFill = false
    // myParticles.particles.fillStyle = '#0033ff';

    //proxy.particles.fillStyle = 'transparent';
    //proxy.lines.strokeStyle = '#8F5219';
    // proxy.particles.size = 5;// ok
    // proxy.particles.draw = false;// ok
    //

    //myParticles.toggleDimensions()
    //--------------------------------------------------------------------------------------------------
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

    // myParticles.updateNumParticles(500)
    // myParticles.updateSpeed(1);
    // myParticles.particles.size = 20;
    //proxy.main.numParticles = 50;

    //myParticles.canvas.width = myParticles.canvas.height = 500
    //myParticles.main.isFullScreen = false


    // PROXY  and HANDLEINPUT ONLY necessary if using inputs



    downloadButton.addEventListener('click', () => {
        // Assuming myParticles is an instance of ParticlesFactory
        //myParticles.getStatusAndSaveToFile();
        myParticles.savePropsStatus2File()
    });


    // testing the use of downloaded config
    const test = {

        "canvas":
            { "id": "my-particles", "width": 500, "height": 500 },

        "main":
            { "numParticles": 3200, "speed": 4.7, "mouseDistance": 100, "fillStyle": "#000", "isFullScreen": true, "isResponsive": true },

        "particles":
            { "shape": "circle", "fillStyle": "#565656", "randomFill": true, "noFill": false, "stroke": true, "size": 60, "randomSize": true, "draw": true, "collision": false, "opacity": 0.7 },

        "lines":
            { "connectDistance": 60, "strokeStyle": "#3a9862", "draw": false, "lineWidth": 1, "opacity": 0.5 },

        "numParticles":
            350
    }


    //console.timeEnd('load')
})();
