
  # ParticlesFactory  ![Project License Badge](https://img.shields.io/badge/license-MIT-brightgreen)

  ## Description

  It's just another Particles JS Canvas :)<br>
  Pure JS/HTML/CSS (only 4kb - minified 2kb)

  **No Dependencies!!!**

  ## Table of Contents

  * [Installation](#Installation)
  * [Usage](#Usage)
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
For now you can simply copy the ParticleFactory.js (4kb - minified 2kb)<br>
And if needed the particlesProxy.js (430byte - minified 130byte) into your project...


  ## Usage

  The usage is just like this
  ```js
  import ParticlesFactory from "yourPathTo/ParticlesFactory.js";

// Initialisation
const options = {
  canvasId: "canvas", // required
  numParticles: 200,
  speed: 0.2,
  strokeColor: "#fff",
  fillColor: "#000",
  connectDistance: 150,
  mouseDistance: 100,
};

const yourParticles = new ParticlesFactory(options);

//exposed methods are:
drawParticles();// now used in the handleInput/proxy
toggleAnimation();// cancel/start requestAnimationFrame
```
<br>
There is an example attached for interactive playing with the particles using inputHandlers.
If you'd like to make use of them, make sure to use the same ids in your HTML and the handleControl function.
If you'd prefer to dynamically change some of the options I added an optional proxy instead of getteres/setters in the class.
In order to make use of that option add it in your js file:<br><br>

```js
import particlesProxy from 'yourPathTo/particlesProxy.js'

// for setting dynamically in JS use the particlesProxy
const yourProxy = particlesProxy(yourParticles);
yourProxy.numParticles = 50;
```
***
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
