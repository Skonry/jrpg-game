import SpriteComponent from '../components/SpriteComponent';
import Entity from './Entity';

export default class PickableItemEntity extends Entity {
  constructor(name, spriteSrc, x, y, width, height) {
    const components = [
      [
        'spriteComponent',
        new SpriteComponent(x, y, width, height, spriteSrc)
      ]
    ]
   
    super(name, 'pickableItem', components);
  }
}
