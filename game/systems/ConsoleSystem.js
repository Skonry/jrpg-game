import displayStyledText from '../utils/displayStyledText.js';
import wrapTextLines from '../utils/wrapTextLines.js';

export default class ConsoleSystem {
  #sprite = new Image();
  #messages = [];

  constructor() {
    this.#sprite.src = 'img/console_bg.png';
  }

  update = ({ systems }) => {
    const sceneSystem = systems.get('sceneSystem');

    if (sceneSystem.currentScene && sceneSystem.currentScene.name !== 'fightScene') return;

    const layerContext = systems.get('renderSystem').layers.get('HUDLayer').context;

    layerContext.save();

    layerContext.fillStyle = 'white';

    layerContext.font = '18px Georgia';

    layerContext.drawImage(this.#sprite, 260, 520, 450, 160);

    this.#messages.forEach((message, i) => {
      const x = 275;

      const y = i * 28 + 550;
      
      displayStyledText(message, layerContext, x, y);
    });
    
    layerContext.restore();
  }

  addMessage = msg => {
    const msgRows = wrapTextLines(msg, 50);

    msgRows.forEach(msgRow => this.#messages.push(msgRow));

    this.#messages = this.#messages.slice(-5);
  }
}
