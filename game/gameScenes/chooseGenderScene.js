import ButtonEntity from '../entities/ButtonEntity';
import pointInsideRectangle from '../utils/pointInsideRectangle';
import CheckboxEntity from '../entities/CheckboxEntity';
import PlayerEntity from '../entities/PlayerEntity';

export default {
  init({ systems, addEntity }) {
    this.alpha = 0;

    const renderSystem = systems.get('renderSystem');

    const layer = renderSystem.addCanvasLayer('Layer');

    addEntity(
      'button', 
      new ButtonEntity('button', 370, 570, 240, 80, 'img/buttons/start_button.png', layer.name)
    )

    addEntity(
      'maleGenderCheckbox', 
      new CheckboxEntity('maleGenderCheckbox', 200, 400, 30, 'Male', layer.name)
    )
    
    addEntity(
      'femaleGenderCheckbox', 
      new CheckboxEntity('femaleGenderCheckbox', 700, 400, 30, 'Female', layer.name)
    )

    layer.context.font = '40px Georgia';
  },

  dispose({ systems, removeEntity }) {
    removeEntity('button');

    removeEntity('maleGenderCheckbox');
    
    removeEntity('femaleGenderCheckbox');

    const renderSystem = systems.get('renderSystem');

    renderSystem.removeCanvasLayer('Layer');
  },
  
  update({ systems, entities, registerEvent, addEntity }) {
    const inputSystem = systems.get('inputSystem');

    const layerContext = systems.get('renderSystem').layers.get('Layer').context;

    layerContext.globalAlpha = this.alpha;

    layerContext.fillStyle = 'rgb(0,0,0)';

    layerContext.fillRect(0, 0, 960, 690);

    layerContext.save();

    layerContext.fillStyle = 'white';

    layerContext.fillText('Choose gender', 340, 390);

    layerContext.restore();

    this.alpha += 0.03;
    
    if (this.alpha > 1) {
      this.alpha = 1;
    }

    const buttonSpriteComponent = entities.get('button').components.get('spriteComponent')

    const maleCheckboxEntity = entities.get('maleGenderCheckbox')
    
    const femaleCheckboxEntity = entities.get('femaleGenderCheckbox')

    const input = inputSystem.inputsToProcess.get('click');

    if (!input) return;

    if (pointInsideRectangle(input.x, input.y, maleCheckboxEntity.components.get('positionComponent'))) {
      maleCheckboxEntity.checked = true;

      femaleCheckboxEntity.checked = false;
    }
    else if (pointInsideRectangle(input.x, input.y, femaleCheckboxEntity.components.get('positionComponent'))) {
      femaleCheckboxEntity.checked = true;

      maleCheckboxEntity.checked = false;
    }
    else if (
      (maleCheckboxEntity.checked || femaleCheckboxEntity) &&
      (pointInsideRectangle(input.x, input.y, buttonSpriteComponent))
    ) {
      const gender = maleCheckboxEntity.checked ? 'male' : 'female';

      const dataSystem = systems.get('dataSystem');

      dataSystem.saveToStorage('playerGender', gender);

      addEntity(
        'player',
        new PlayerEntity(dataSystem.readFromStorage('playerName'), gender)
      )

      registerEvent('requestedLevelChange', { name: 'startLevel' })
    }
  }
};
