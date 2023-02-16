import ButtonEntity from "../entities/ButtonEntity";

export default {
  init({ systems, addEntity, entities }) {
    this.playerMoves = [];

    this.leftArrowSprite = new Image();

    this.leftArrowSprite.src = 'img/left_arrow.png';

    this.rightArrowSprite = new Image();

    this.rightArrowSprite.src = 'img/right_arrow.png';

    const renderSystem = systems.get('renderSystem');

    const layerContext = renderSystem.addCanvasLayer('Layer');

    addEntity(
      'returnButton',
      new ButtonEntity(40, 610, 160, 80, 'img/btn_back.png', layerContext)
    ); 

    const playerItems = systems.get('equipmentSystem').inventoryItems;

    this.chest = systems.get('chestSystem').chest;

    this.lockPickItem = playerItems.find(item => item.type === 'lockpick');
  },

  update({ systems, registerEvent }) {
    const consoleSystem = systems.get('consoleSystem');

    const inputSystem = systems.get('inputSystem');

    const levelSystem = systems.get('levelSystem');

    const skillsSystem = systems.get('skillsSystem');

    const layerContext = systems.get('renderSystem').layers('Layer').context;

    if (this.playerMoves.length === this.chest.openingCode.length && !this.opened) {
      consoleSystem.addMessage('Udało ci się otworzyć zamek!');

      this.chest.opened = true;
    }

    layerContext.fillStyle = 'black';
    //Layer.fillRect(0, 0, 960, 690);

    if (this.playerMoves.length > 0) {
      const centerElement = Math.floor(this.playerMoves.length / 2);

      const centerElementXPosition = 375 - (this.playerMoves.length % 2 === 0 ? 0 : 55);

      layerContext.save();

      layerContext.fillStyle = 'rgb(99, 92, 142)';

      layerContext.globalAlpha = 0.5;

      layerContext.fillRect(
        centerElementXPosition - centerElement * 110 + 50,
        280,
        (this.playerMoves.length + 1) * 110,
        140
      );

      layerContext.restore();

      this.playerMoves.forEach((move, i) => {
        layerContext.drawImage(
          move === 'left' ? this.leftArrowSprite : this.rightArrowSprite, 
          centerElementXPosition + (i + 1 - centerElement) * 110, 
          300
        );
      });
    }

    layerContext.save();

    layerContext.fillStyle = 'white';

    layerContext.font = '45px Georgia';

    layerContext.fillText('Ilość wytrychów w plecaku: ' + this.playerLockpiks, 200, 60);

    layerContext.restore();

    this.processMouseClick(inputSystem, levelSystem, registerEvent);

    this.processKeyboardInputs(inputSystem, consoleSystem, skillsSystem);
  },

  dispose({ removeEntity }) {
    removeEntity('returnButton');

    if (this.isOpened) removeEntity(this.chest.name);
  },

  processMouseClick(inputSystem, levelSystem, registerEvent) {
    if (!inputSystem.inputsToProcess.get('click')) return;

    const { x, y } = inputSystem.inputsToProcess.get('click');

    if (pointInsideRectangle(x, y, this.returnButton)) {
      const levelName = levelSystem.currentLevel.name;

      registerEvent('requestedLevelChange', { name: levelName });
    }
  },

  processKeyboardInputs(inputSystem, consoleSystem, skillsSystem) {
    const inputKey = inputSystem.inputsToProcess.get('letterKeyDown').key

    let playerMove = null;

    if (inputKey === 'arrowLeft') playerMove = 'left';

    if (inputKey === 'arrowRight') playerMove = 'right';

    if (!playerMove) return;

    if (lockPickItem.stackAmount === 0) {
      consoleSystem.addMessage('Brak wytrychów w plecaku!');

      return;
    }

    if (playerMove === this.chest.openCode[this.playerMoves.length]) {
      this.playerMoves.push(playerMove);

      consoleSystem.addMessage('Dobrze.');
    }

    else {
      this.playerMoves = [];

      consoleSystem.addMessage('Ups... Pomyłka.');

      if (skillsSystem.skillCheck('openLocks')) {
        this.lockPickItem.stackAmount--;

        consoleSystem.addMessage('Złamał ci się wytrych!');
      }
    }
  }
};
