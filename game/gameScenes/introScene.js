import PlayerEntity from "../entities/PlayerEntity";

export default {
  init({ addEntity, systems, registerEvent }) {
    if (localStorage.getItem('gameState')) {
      registerEvent('requestedSceneChange', { name: 'mainMenu' })
    }

    addEntity(
      'player',
      new PlayerEntity('Name', 'male')
    )

    this.texts = ['Miejsce na intro,','miejsce na intro2,','miejsce na intro3,'];
    this.currentTextIndex = 0;
    this.alpha = 1;
    this.fadeIn = true;
    this.fadeOut = false;
    this.counter = 0;

    const renderSystem = systems.get('renderSystem');

    const layer = renderSystem.addCanvasLayer('Layer');

    layer.context.font = '50px Georgia';
    layer.context.shadowColor = 'rgb(91, 47, 145)';
    layer.context.shadowOffsetX = 4;
    layer.context.shadowOffsetY = 4;
    layer.context.shadowBlur = 8;
  },

  update({ systems, registerEvent }) {
    const inputSystem = systems.get('inputSystem');

    const layerContext = systems.get('renderSystem').layers.get('Layer').context;

    layerContext.fillStyle = 'black';

    layerContext.fillRect(0, 0, 960, 690);

    layerContext.fillStyle = 'white';

    layerContext.save();

    layerContext.globalAlpha = this.alpha;

    const textLength = Math.round(layerContext.measureText(this.texts[this.currentTextIndex]).width);

    layerContext.fillText(this.texts[this.currentTextIndex], (960 - textLength) / 2, 350);

    layerContext.restore();

    if (this.currentTextIndex >= this.texts.length) {
      registerEvent('requestedSceneChange', { name: 'chooseName' })
    }

    if (this.fadeIn) {
      this.fadeInText();
    }
    
    if (this.fadeOut) {
      this.fadeOutText();
    }

    this.counter++;

    if (this.counter >= 120) {
      this.fadeOut = true;
    }

    if (inputSystem.inputsToProcess.get('spaceDown')) {
      this.skipSlide();
    }
  },
  
  skipSlide() {
    this.currentTextIndex++;
    this.alpha = 0;
    this.fadeOut = false;
    this.counter = 0;
    this.fadeIn = true;
  },

  fadeInText() {
    this.alpha += 0.02;
    if (this.alpha >= 1) {
      this.alpha = 1;
      this.fadeIn = false;
    }
  },

  fadeOutText() {
    this.alpha -= 0.02;
    if (this.alpha <= 0) {
      this.skipSlide();
    }
  }
};
