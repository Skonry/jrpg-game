import Entity from './Entity.js';
import SpriteComponent from '../components/SpriteComponent';
import TextLabelComponent from '../components/TextLabelComponent';

export default class ProgressBarEntity extends Entity {
  constructor(name, x, y, width, height, borderSize, sprite, bgSprite, layer, textLabel = '', textColors = 'white') {
    const components = [
      [
        'spriteComponent', 
        new SpriteComponent(
          x + borderSize, 
          y + borderSize, 
          width - borderSize * 2, 
          height - borderSize * 2, 
          sprite, 
          layer
        )
      ],
      [
        'backgroundSpriteComponent', 
        new SpriteComponent(x, y, width, height, bgSprite, layer)
      ],
      [
        'textLabelComponent',
        new TextLabelComponent(textLabel, textColors, layer)
      ]
    ];

    super(name, 'progressBar', components);

    this.borderSize = borderSize;
  }
}
