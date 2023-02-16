import Entity from "./Entity";
import SpriteComponent from '../components/SpriteComponent';


export default class ButtonEntity extends Entity {
  constructor(name, x, y, width, height, spriteSrc, layerName) {
    const components = [
      [
        'spriteComponent', 
        new SpriteComponent(x, y, width, height, spriteSrc, layerName)
      ]
    ];

    super(name, 'button', components);
  }
}
