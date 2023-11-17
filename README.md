
  # PariclesFactory  ![Project License Badge](https://img.shields.io/badge/license-MIT-brightgreen)

  ## Description

  It's just another Particles JS Canvas :)<br>
  Pure JS/HTML/CSS

  #### NO DEPENDENCIES!!!

  ## Table of Contents

  * [Installation](#Installation)
  * [Usage](#Usage)
  * [Contributing](#Contributing)
  * [License](#license)
  * [Questions](#Questions)
  * [Acknowledgement](#Acknowledgement)

  ***
  Click the button below to play with it on netlify:<br><br>
  [![Netlify Status](https://api.netlify.com/api/v1/badges/ba7818d0-76da-49a3-bd61-e75e9c130101/deploy-status)](https://particles-factory.netlify.app/)
  ***
![PartilesFactory_Image](/Particles-Factory.png)
  ## Installation
    For now you can simply load the ParticleFactory.js (4kb)
    And if needed the particlesProxy.js (430byte) into your project...


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
```
There is an example attached for interactive playing with the particles using inputHandlers.
If you'd like to make use of them, make sure to use the same ids in your HTML and the handleControl function.
If you'd prefer to dynamically change some of the options I added an optional proxy instead of getteres/setters in the class.
In odrder to make use of that option add it in your js file:

```js
import particlesProxy from 'yourPathTo/particlesProxy.js'

// for setting dynamically in JS use the particlesProxy
const yourProxy = particlesProxy(yourParticles);
yourProxy.numParticles = 50;

```

  ## Contributing

  Any questions or suggestions are highly appreciated. If you'd like to contribute, just fork the project and open a pullrequest - or discuss your ideas with me. Also if you got an idea for a project where I could contribute, shout out! ...


  ## License


<details>
 <summary><b>MIT License<b></summary>
<br>
Copyright (c) 2023 BarbWire-1

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE..</br>
    </details>



  ## Questions

  If you have any questions about the project you can reach out to me via email or GitHub with the information below.

  >Email: barbwire.clocks@gmail.com

  >GitHub : [BarbWire-1](https://github.com/BarbWire-1)



  ## Acknowledgement
  This readme-file was created with the awesome
  https://github.com/Thenlie/readme-generator<br><br>
  Thank you, Thenlie. It's just an ease!!!
