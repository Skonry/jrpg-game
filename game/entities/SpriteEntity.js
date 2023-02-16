import SpriteComponent from "../components/SpriteComponent";
import Entity from "./Entity";

export default class SpriteEntity extends Entity {
  constructor(name, x, y, width, height, spriteSource, layerName) {
    const components = [
      [
        'spriteComponent',
        new SpriteComponent(x, y, width, height, spriteSource, layerName)
      ],
    ]

    super(name, 'sprite', components)
  }
}
