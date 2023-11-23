
  # ParticlesFactory  ![Project License Badge](https://img.shields.io/badge/license-MIT-brightgreen)

  ## Description

  It's just another Particles JS Canvas :)<br>
  Pure JS/HTML/CSS (only 4kb - minified 2kb, or 7kb with additional proxy and eventHandling for input/click)

  **No Dependencies!!!**

  ## Table of Contents

  * [Installation](#Installation)
  * [Usage](#Usage)
  * [Use as interactive Background](#Background)
  * [Contributing](#Contributing)
  * [License](LICENSE)
  * [Questions](#Questions)
  * [Acknowledgement](#Acknowledgement)

  ***
  Click the button below to play with it on netlify:<br><br>
  [![Netlify Status](https://api.netlify.com/api/v1/badges/ba7818d0-76da-49a3-bd61-e75e9c130101/deploy-status)](https://particles-factory.netlify.app/)

![PartilesFactory_Image](/Particles-Factory.png)
***


## Installation
For now you can simply copy the ParticlesFactory - folder holding the src and index.js with the exports into your project.<br>
To reduce size you can remove unnecessary as not used parts (Particle.js and ParticlesFactory.js are required to make it work).
&nbsp;

  ## Usage

  The usage is just like this
  ```js
  import { ParticlesFactory, handleEvents, particlesProxy } from "yourPathTo/ParticlesFactory/index.js";

// Initialisation
const options = {
  canvasId: "canvas", // required
  numParticles: 200,
  speed: 0.2,
  strokeColor: "#fff",
  bgColor: "#000",
  connectDistance: 150,
  mouseDistance: 100,
};

const yourParticles = new ParticlesFactory(options);

// optional for using inputElements  or click-events
// takes the element and the id of the parentElement holding the inputs
// (for event-delegation)
handleEvents(yourParticles, "controlPanelContainer");

// for setting dynamically in JS use the particlesProxy
const proxy = particlesProxy(yourParticles);
proxy.numParticles = 150;
```

**ATTRIBUTES**

* canvas
* numParticles
* speed
* strokeColor
* bgColor
* connectDistance
* mouseDistance

NEW (11-23-23)
* particlesSize
* particlesColor


**METHODS**

* createParticles() - now used in the handleInput/proxy
* toggleAnimation() - cancel/start requestAnimationFrame
<br><br>


To make use of the `handleInput()` and/or the `particlesProxy()` the input-elements and the clickable elements need to have a data-attributes beginning with the prefix "particles-" to avoid interferation with other datasets.

Like in the example for the inputs to change attribute-values set


```html
<input data-attribute="particles-speed"/> <!--other settings-->
```

The clickable elements need to be set up like

```html
<button data-action="particles-toggleAnimation"></button><!--other settings-->
```

Inside the [handleEvents()](./ParticlesFactory/src/handleEvents.js) you can define your custom event callback if needed, key is the data-action, value the assiociated callback.
<br>

```js
const clickAction = {
      togglePanel: () => container.classList.toggle("open"),
      toggleAnimation: () => el.toggleAnimation(),
      // add more callbacks here if needed
    };
```
<br>


Instantiate a `particlesProxy()` for dynamically settings if needed.
The proxy handles a data-double-binding to keep el.attributes and input values in sync.
```js
const yourProxy = particlesProxy(yourParticles);
yourProxy.numParticles = 50;
```
<br>


## Background
In order to use the canvas as an **interactive background**, create a div on top to wrap your page's content.

```css
.content-wrapper {
     position: absolute;
     top: 0;
     left: 0;
     width: 100vw;
     height: 100vh;

     z-index: 100;/* or any value as needed */
     pointer-events: none;
}
```

To interact with the elements INSIDE your content-wrapper, you then need to set them to `pointer-events: auto` or any other detection you want.
***
<br><br>
  ## Contributing

If you'd like to contribute, just fork the project and open a pullrequest - or discuss your ideas with me. Also if you got an idea for a project where I could contribute, shout out! ...



## Questions
If you have any questions, suggestions or criticism about the project you can reach out to me via email or GitHub with the information below.

>Email: barbwire.clocks@gmail.com

>GitHub : [BarbWire-1](https://github.com/BarbWire-1)

***

## Acknowledgement
*This readme-file was mainly created with the awesome
[readme-generator](https://github.com/Thenlie/readme-generator) by Thenlie.<br>
Thank you, Thenlie. It's just an ease!!!*
