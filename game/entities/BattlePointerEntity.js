import SpriteComponent from "../components/SpriteComponent";
import Entity from "./Entity";

export default class BattlePointerEntity extends Entity {
  constructor(x, y, layerName) {
    const components = [
      [
        'spriteComponent',
        new SpriteComponent(x, y, 50, 50, 'img/pointer.png', layerName)
      ]
    ]

    super('battlePointer', 'battlePointer', components);
  }
}
