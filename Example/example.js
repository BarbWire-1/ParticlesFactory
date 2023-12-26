import {
	ParticlesFactory,
	handleInterfaceEvents,
    particlesProxy,
    createElementsFromProperties
} from '../ParticlesFactory/index.js';


export default (function createExample() {

//console.time('load')
    // Initialisation
    const options = {
        canvas: {
            id: 'my-particles',
            width: 500,
            height: 500,
            // fillStyle: '#000',
        },
        main: {
            numParticles: 150,
            frameRate: 17,
            speed: 1,
            mouseDistance: 100,
            isFullScreen: true,
            isResponsive: true, // whether to recalculate x,y of particles on resize
        },
        particles: { fillStyle: '#0000ff', opacity: .7, noFill: true, size: 50, draw: true, collision: false, shape: 'circle' }, // optional - with defaults if only "particles"
        lines: { connectDistance: 100, strokeStyle: '#79d1e6', opacity: 0.5, lineWidth: 1, draw: true }, // optional - with defaults if only "lines"
    };

    // for testing frame throttling
    const fullstuff =
    {

        "canvas":
            { "id": "my-particles", "width": 500, "height": 500 },

        "main":
            { "frameRate": 17, "numParticles": 100, "speed": .7, "mouseDistance": 180, "fillStyle": "#000", "isFullScreen": true, "isResponsive": true },

        "particles":
            { "shape": "circle", "fillStyle": "#0033ff", "randomFill": true, "noFill": false, "stroke": false, "size": 23, "randomSize": true, "draw": true, "collision": false, "opacity": 0.7 },

        "lines":
            { "connectDistance": 60, "strokeStyle": "#79d1e6", "draw": true, "lineWidth": 1, "opacity": 0.5 },


    }

    const testOptions = JSON.parse(JSON.stringify(options))


    //const myParticles = new ParticlesFactory(options);
    // test object
    const myParticles = new ParticlesFactory(testOptions);

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
