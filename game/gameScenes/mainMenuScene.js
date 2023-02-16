import ButtonEntity from "../entities/ButtonEntity";
import PlayerEntity from "../entities/PlayerEntity";
import pointInsideRectangle from "../utils/pointInsideRectangle";

export default {
  init({ systems, addEntity }) {
    this.alpha = 0;

    const dataSystem = systems.get('dataSystem');

    this.gameIsPaused = dataSystem.readFromStorage('gameIsPaused');

    const renderSystem = systems.get('renderSystem');

    const layer = renderSystem.addCanvasLayer('Layer');

    addEntity(
      'continueGameButton', 
      new ButtonEntity('continueGameButton', 320, 90, 320, 80, 'img/buttons/continue_button.png', layer.name)
    )

    if (this.gameIsPaused) {
      addEntity(
        'saveGameButton', 
        new ButtonEntity('saveGameButton', 320, 290, 320, 80, 'img/buttons/save_game_button.png', layer.name)
      )
  
      addEntity(
        'returnToGameButton', 
        new ButtonEntity('returnToGameButton', 320, 490, 320, 80, 'img/buttons/return_button.png', layer.name)
      )
    }
    else {
      addEntity(
        'newGameButton', 
        new ButtonEntity('newGameButton', 320, 190, 320, 80, 'img/buttons/new_game_button.png', layer.name)
      )
    }

    addEntity(
      'optionsButton', 
      new ButtonEntity('optionsButton', 320, 390, 320, 80, 'img/buttons/options_button.png', layer.name)
    )
  },

  dispose({ removeEntity }) {
    removeEntity('continueGameButton');
    removeEntity('newGameButton');
    removeEntity('saveGameButton');
    removeEntity('returnToGameButton');
    removeEntity('optionsButton');
  },
  
  update({ systems, entities, registerEvent, addEntity }) {
    const inputSystem = systems.get('inputSystem');

    const layerContext = systems.get('renderSystem').layers.get('Layer').context;

    layerContext.globalAlpha = this.alpha;

    layerContext.fillStyle = 'rgb(0,0,0)';

    layerContext.fillRect(0, 0, 960, 690);

    this.alpha += 0.03;

    if (this.alpha > 1) {
      this.alpha = 1;
    }

    const clickInput = inputSystem.inputsToProcess.get('click');

    const continueGameButtonSpriteComponent = entities.get('continueGameButton').components.get('spriteComponent');

    if (clickInput) {
      if (pointInsideRectangle(clickInput.x, clickInput.y, continueGameButtonSpriteComponent)) {
        const localStorageSystem = systems.get('localStorageSystem');

        addEntity(
          'player',
          new PlayerEntity()
        )

        localStorageSystem.loadState(entities, systems);

        registerEvent('requestedLevelChange', { name: 'startLevel' })
      }
      else if (
        !this.gameIsPaused && 
        pointInsideRectangle(
          clickInput.x, 
          clickInput.y, 
          entities.get('newGameButton').components.get('spriteComponent')
        )
      ) {
        if (confirm('Starting a new game will delete your progress. Do you want to continue?')) {
          localStorage.clear();

          registerEvent('requestedSceneChange', { name: 'intro' })
        }
      }
      else if (
        this.gameIsPaused && 
        pointInsideRectangle(
          clickInput.x, 
          clickInput.y, 
          entities.get('saveGameButton').components.get('spriteComponent')
        )
      ) {
        this.game.localStorage.saveGameState(this.game);
      }
      else if (
        this.gameIsPaused &&
        pointInsideRectangle(
          clickInput.x, 
          clickInput.y, 
          entities.get('returnToGameButton').components.get('spriteComponent')
        )
      ) {
        const dataSystem = systems.get('dataSystem');

        const levelName = dataSystem.loadFromStorage('currentLevelName')

        registerEvent('requestedLevelChange', { name: levelName })
      }
    }

    const escapeDownInput = inputSystem.inputsToProcess.get('escapeDown');

    if (escapeDownInput && this.gameIsPaused) {
      const levelSystem = systems.get('levelSystem');

      const dataSystem = systems.get('dataSystem');

      const levelName = dataSystem.loadFromStorage('currentLevelName')

      levelSystem.changeCurrentLevel(levelName);
    }
  }
};
