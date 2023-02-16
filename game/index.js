import Game from './Game.js';
import loadSystems from './loadSystems.js';

const game = new Game();

loadSystems(game);

const onDomContentLoaded = () => {
  document.removeEventListener('DOMContentLoaded', onDomContentLoaded);

  game.start();
}

document.addEventListener('DOMContentLoaded', onDomContentLoaded);

window.game = game;
