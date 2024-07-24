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





    //console.timeEnd('load')
})();
