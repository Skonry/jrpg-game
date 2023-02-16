export default class FloatingTextsSystem {
  #texts = [];

  update = ({ systems }) => {
    const currentSceneName = systems.get('sceneSystem').currentSceneName();

    if (currentSceneName !== 'fightScene') return;
    
    const renderSystem = systems.get('renderSystem');

    const layerContext = renderSystem.layers.get('FloatingTexts').context;

    this.#texts.forEach(text => {
      text.y -= 2;

      layerContext.save();

      layerContext.fillStyle = text.color;
      
      layerContext.font = '35px Georgia';

      layerContext.strokeText(text.content, text.x, text.y);

      layerContext.fillText(text.content, text.x, text.y);
      
      layerContext.restore();
    });
  }

  addFloatingText = (content, x, y, color, duration) => {
    const textReference = this.#texts.push({ content, x, y, color });

    setTimeout(() => this.#texts.filter(text => text !== textReference), duration);
  }
}
