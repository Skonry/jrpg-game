import Entity from './Entity.js';
import SpriteComponent from '../components/SpriteComponent';

export default class PlayerInventoryEntity extends Entity {
  constructor(name, x, y, width, height, sprite) {
    const components = [
      [
        'spriteComponent', 
        new SpriteComponent(x, y, width, height, sprite)
      ]
    ];

    super(name, 'playerInventory', components);
  }
}
