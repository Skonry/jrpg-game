import ButtonEntity from "../entities/ButtonEntity";
import pointInsideRectangle from '../utils/pointInsideRectangle';

export default {
  init({ systems, addEntity }) {
    this.alpha = 0;
    this.playerName = '';

    const renderSystem = systems.get('renderSystem');

    const layer = renderSystem.addCanvasLayer('Layer');

    addEntity('button', new ButtonEntity('button', 370, 570, 240, 80, 'img/buttons/start_button.png', layer.name))

    layer.context.font = '40px Georgia';
  },

  dispose({ removeEntity, systems }) {
    removeEntity('button');

    const renderSystem = systems.get('renderSystem');

    renderSystem.removeCanvasLayer('Layer');
  },
  
  update({ systems, entities, registerEvent }) {
    const inputSystem = systems.get('inputSystem');

    const layerContext = systems.get('renderSystem').layers.get('Layer').context;

    layerContext.globalAlpha = this.alpha;

    layerContext.fillStyle = 'rgb(0,0,0)';

    layerContext.fillRect(0, 0, 960, 690);

    layerContext.fillStyle = 'white';

    layerContext.fillText('Enter your character name', 230, 100);

    layerContext.fillRect(280, 400, 400, 70);

    layerContext.fillStyle = 'black';

    layerContext.fillText(this.playerName, 300, 445);

    this.alpha += 0.03;

    if (this.alpha > 1) {
      this.alpha = 1;
    }

    if (inputSystem.inputsToProcess.get('backspaceDown')) {
      this.removeCharacter();
    }

    if (inputSystem.inputsToProcess.has('letterKeyDown')) {
      this.addCharacter(inputSystem.inputsToProcess.get('letterKeyDown').key)
    }

    const input = inputSystem.inputsToProcess.get('click');

    const buttonSpriteComponent = entities.get('button').components.get('spriteComponent')

    if (input && pointInsideRectangle(input.x, input.y, buttonSpriteComponent)) {
      const dataSystem = systems.get('dataSystem');

      dataSystem.saveToStorage('playerName', this.playerName);

      registerEvent('requestedSceneChange', { name: 'chooseGender' })
    }
  },

  addCharacter(key) {
    this.playerName += key;
  },

  removeCharacter() {
    this.playerName = this.playerName.slice(0, this.playerName.length - 1);
  }
};
