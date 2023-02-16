import SpriteComponent from '../components/SpriteComponent';
import Entity from './Entity';

export default class ItemEntity extends Entity {
  constructor(name, spriteSrc, type, requirements, bonus, value, stackable) {
    const components = [
      [
        'spriteComponent',
        new SpriteComponent(0, 0, 50, 50, spriteSrc)
      ]
    ]

    super(name, 'item', components);

    this.type = type;
    this.requirements = requirements;
    this.bonus = bonus;
    this.value = value;
    this.stackable = stackable;
  }
}
