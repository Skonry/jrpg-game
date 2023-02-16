import Keyboard from './Keyboard.js';
import Mouse from './Mouse.js';
import Signal from './Signal.js';

export default class InputSystem {
  inputsToProcess = new Map();
  #queuedInputs = new Map();
  #signals = new Map();

  constructor(canvas) {
    this.keyboard = new Keyboard(this.#addInputToQueue);
    this.mouse = new Mouse(canvas, this.#addInputToQueue);
  }

  update = () => {
    this.inputsToProcess = new Map(this.#queuedInputs);
    
    this.#queuedInputs = new Map();
  }

  subscribeSignal = (signalName, callback, id) => {
    if (!this.#signals.has(signalName)) {
      this.#signals.set(signalName, new Signal());
    }

    this.#signals.get(signalName).subscribers.push({callback, id});
    
    return id;
  }
   
  removeSignalCallback(id, signalName) {
    const index = this.#signals.get(signalName).subscribers.findIndex((subscriber) => subscriber.id === id);

    this.#signals.get(signalName).subscribers.splice(index, 1);
  }

  #addInputToQueue = (name, data) => {
    this.#queuedInputs.set(name, data);

    if (!this.#signals.has(name)) return;
    
    this.#signals.get(name).subscribers.forEach(subscriber => subscriber.callback());
  }
}
