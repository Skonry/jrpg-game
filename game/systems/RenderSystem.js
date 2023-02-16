export default class RenderSystem {
  #canvas = document.createElement('canvas')
  #context = this.#canvas.getContext('2d')
  layers = new Map();

  constructor(width, height, domContainerId) {
    this.#canvas.width = width;
    this.#canvas.height = height;

    document.getElementById(domContainerId).appendChild(this.#canvas);
  }

  translateLayer = (layer, x, y) => {
    this.layers.get(layer).context.translate(x, y);
  }

  addCanvasLayer = (name, indexOrder = 0, width = 960, height = 690, x = 0, y = 0) => {
    const layer = {
      name,
      indexOrder,
      width,
      height,
      x,
      y,
      canvas: document.createElement('canvas')
    }
    
    layer.canvas.width = width;

    layer.canvas.height = height;

    layer.context = layer.canvas.getContext('2d');
   
    this.layers.set(name, layer);
    
    return layer
  }

  removeCanvasLayer = name => this.layers.delete(name);

  getCanvasElement = () => this.#canvas;

  update = ({ entities }) => {
    this.#drawSprites(entities);

    this.#drawTexts(entities);

    this.#drawCheckboxes(entities);

    this.#drawLayers();
  }

  #drawSprites = entities => {
    entities.forEach(entity => {
      const backgroundSpriteComponent = entity.components.get('backgroundSpriteComponent');

      const spriteComponent = entity.components.get('spriteComponent');

      if (backgroundSpriteComponent) {
        const layer = this.layers.get(backgroundSpriteComponent.layerName);

        layer.context.drawImage(
          backgroundSpriteComponent.sprite, 
          backgroundSpriteComponent.x, 
          backgroundSpriteComponent.y, 
          backgroundSpriteComponent.width, 
          backgroundSpriteComponent.height
        );
      }

      if (spriteComponent) {
        const layer = this.layers.get(spriteComponent.layerName);

        layer.context.drawImage(
          spriteComponent.sprite, 
          spriteComponent.x, 
          spriteComponent.y, 
          spriteComponent.width, 
          spriteComponent.height
        );
      }
    });
  }

  #drawTexts = entities => {
    entities.forEach(entity => {
      const textLabelComponent = entity.components.get('textLabelComponent');

      if (textLabelComponent) {
        const layer = this.layers.get(textLabelComponent.layerName);

        layer.context.save();

        layer.context.fillStyle = textLabelComponent.color

        layer.context.fillText(
          textLabelComponent.text,
          textLabelComponent.x, 
          textLabelComponent.y, 
        );

        layer.context.restore();
      }
    });
  }

  #drawLayers = () => {
    const sortedLayers = Array.from(this.layers.values()).sort((a, b) => a.indexOrder - b.indexOrder)

    this.#context.clearRect(0, 0, 1000, 1000);

    sortedLayers.forEach(layer => {
      this.#context.drawImage(layer.canvas, layer.x, layer.y, layer.width, layer.height);
      
      layer.context.clearRect(layer.x - 1000, layer.y -1000, layer.width + 2000, layer.height + 2000);
    });
  }

  #drawCheckboxes = entities => {
    const checkboxes = Array.from(entities.values()).filter(entity => entity.class === 'checkbox');

    checkboxes.forEach(checkbox => {
      const component = checkbox.components.get('positionComponent');

      const layerContext = this.layers.get('Layer').context;

      layerContext.save();

      layerContext.font = checkbox.checked ? "32px Georgia" : "20px Georgia";

      layerContext.fillStyle = 'white';

      layerContext.beginPath();

      layerContext.arc(
        component.x + component.width / 2, 
        component.y + component.height / 2, 
        component.width / 2, 
        0,
        2 * Math.PI
      );

      layerContext.fill();

      layerContext.fillText(
        checkbox.label,
        (component.x + component.width / 2) - (Math.round(layerContext.measureText(checkbox.label).width / 2)),
        component.y + component.height * 2
      );

      if (checkbox.checked) {
        layerContext.fillStyle = 'black';

        layerContext.beginPath();

        layerContext.arc(
          component.x + component.width / 2, 
          component.y + component.height / 2, 
          (component.width - 12) / 2, 
          0, 
          2 * Math.PI
        );

        layerContext.fill();
      }

      layerContext.restore();
    });
  }
}

