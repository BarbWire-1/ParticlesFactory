export function handleEvents(el, containerId) {
  // event-delegation on parent container
  const container = document.getElementById(containerId);

  // EVENT - CALLBACKS
  /**
   *
   * @param {*} el The particles instance
   * @param {*} attribute The value of the data-attribute of the target input element
   * @param {*} value The recieved value to apply to the el's attribute of same name
   */
  function handleInputChange(el, attribute, value) {
    el[attribute] = +value || value;
    if (attribute === "numParticles" || attribute === "speed")
      el.drawParticles();
  }

  function handleButtonClick(e) {
    const dataAction = e.target.getAttribute("data-action");

    const clickAction = {
      "particles-togglePanel": () => container.classList.toggle("open"),
      "particles-toggleAnimation": () => el.toggleAnimation(),
      // add more callbacks here if needed
    };

    if (clickAction[dataAction]) clickAction[dataAction]();
  }

  // EVENT LISTENERS
  container.addEventListener("click", handleButtonClick);
  container.addEventListener("input", (event) => {
    if (!event.target.matches("input")) return;

      const { dataset, value } = event.target;
      const attribute = dataset.attribute.split('-')[1]
    handleInputChange(el, attribute, value);
  });

  // for resposiveness
  // set relative width/height in CSS
  function resizeCanvas() {
    el.canvas.width = window.innerWidth;
    el.canvas.height = window.innerHeight;
    el.drawParticles();
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas(); // initial size-adjustment
}
