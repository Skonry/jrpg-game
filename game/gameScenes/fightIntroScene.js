export default {
  init({ systems }) {
    this.alpha = 0;
    this.text = 'Walka';

    const renderSystem = systems.get('renderSystem');

    renderSystem.addCanvasLayer('Layer');
  },
  
  update({ systems, registerEvent }) {
    this.alpha += 0.005;

    if (this.alpha > 1) {
      registerEvent('requestedSceneChange', { name: 'fightScene' })
    }

    const layerContext = systems.get('renderSystem').layers.get('Layer').context;
    
    layerContext.fillStyle = 'rgb(255,255,255)';

    layerContext.fillRect(0, 0, 960, 690);

    layerContext.globalAlpha = this.alpha;

    layerContext.fillStyle = 'rgb(0,0,0)';

    layerContext.font = '70px Georgia';

    layerContext.shadowColor = 'rgb(77, 193, 214)';

    layerContext.shadowOffsetX = 5;

    layerContext.shadowOffsetY = 5;

    layerContext.shadowBlur = 20;

    const textLength = Math.round(layerContext.measureText(this.text).width);
    
    layerContext.fillText(this.text , (960 - textLength) / 2, 360);
  }
};
