export default function handleControl(el) {
  // event-delegation on controlPanelContainer
  const controlPanel = document.getElementById("controlPanelContainer");

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
      togglePanel: () => controlPanel.classList.toggle("open"),
      toggleAnimation: () => el.toggleAnimation(),
    };

    if (clickAction[dataAction]) clickAction[dataAction]();
  }

  // EVENT LISTENERS
  controlPanel.addEventListener("click", handleButtonClick);
  controlPanel.addEventListener("input", (event) => {
    if (!event.target.matches("input")) return;

    const { dataset, value } = event.target;
    handleInputChange(el, dataset.attribute, value);
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
