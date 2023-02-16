import Key from './Key.js';
import lowerCaseFirstLetter from '../../utils/lowerCaseFirstLetter.js';

export default class Keyboard {
  #callback

  arrowUp = new Key(true);
  arrowDown = new Key(true);
  arrowLeft = new Key(true);
  arrowRight = new Key(true);
  space = new Key();
  escape = new Key();
  backspace = new Key();
  a = new Key();
  b = new Key();
  c = new Key();
  d = new Key();
  e = new Key();
  f = new Key();
  g = new Key();
  h = new Key();
  i = new Key();
  j = new Key();
  k = new Key();
  l = new Key();
  m = new Key();
  n = new Key();
  o = new Key();
  p = new Key();
  q = new Key();
  r = new Key();
  s = new Key();
  t = new Key();
  u = new Key();
  v = new Key();
  w = new Key();
  x = new Key();
  y = new Key();
  z = new Key();
  ['1'] = new Key();
  ['2'] = new Key();
  ['3'] = new Key();
  ['4'] = new Key();
  ['5'] = new Key();
  ['6'] = new Key();
  ['7'] = new Key();
  ['8'] = new Key();
  ['9'] = new Key();
  ['0'] = new Key();

  constructor(callback) {
    this.#callback = callback
    
    document.addEventListener('keydown', this.#handleDomEvent);
    document.addEventListener('keyup', this.#handleDomEvent);
  }
  
  #handleDomEvent = input => {
    let key = lowerCaseFirstLetter(input.key);

    if (key === ' ') key = 'space';
    
    if (!this[key]) return;

    if (input.type === 'keydown') {
      if (!this[key].isDown || this[key].repeatable) {
        const signalData = {
          key,
          keyCode: input.keyCode,
          device: 'keyboard'
        };

        this.#callback(key + 'Down', signalData);

        if (input.keyCode > 47 && input.keyCode < 91) {
          this.#callback('letterKeyDown', signalData);
        }
      }
      
      this[key].isDown = true;
    }
    else {
      this[key].isDown = false;
    }
  }
}
