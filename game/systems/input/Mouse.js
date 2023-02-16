export default class Mouse {
  x = 0;
  y = 0;
  #callback;

  constructor(domElement, callback) {
    this.#callback = callback;
    
    domElement.addEventListener('mousedown', this.#handleDomEvent);
    domElement.addEventListener('mousemove', this.#handleDomEvent);
    domElement.addEventListener('mouseup', this.#handleDomEvent);
    domElement.addEventListener('dblclick', this.#handleDomEvent);
    domElement.addEventListener('click', this.#handleDomEvent);
  }

  #handleDomEvent = event => {
    const signalData = {
      x: event.x,
      y: event.y,
      type: event.type,
      device: 'mouse',
    };

    if (event.type === 'click') {
      this.#callback('click', signalData);
    }
    else if (event.type === 'dbclick') {
      this.#callback('doubleClick', signalData)
    }
    else if (event.type === 'mousemove') {
      this.#callback('mouseMove', signalData);

      this.x = signalData.x;
      this.y = signalData.y;
    }
    else if (event.type === 'mousedown') {
      this.#callback('mouseDown', signalData);
    }
    else if (event.type === 'mouseup') {
      this.#callback('mouseUp', signalData);
    }
  }
}
