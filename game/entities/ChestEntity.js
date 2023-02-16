import SpriteComponent from "../components/SpriteComponent";
import PositionComponent from "../components/PositionComponent";
import Entity from "./Entity";

export default class ChestEntity extends Entity {
  constructor(name, x, y, openingCode, layerName) {
    const components = [
      [
        'spriteComponent',
        new SpriteComponent(x, y, 50, 50, 'img/skrzynia.png', layerName)
      ],
      [
        'positionComponent',
        new PositionComponent(x, y, 50, 50)
      ]
    ]
    super(name, 'chest', components)

    this.openingCode = openingCode;
    this.isOpened = false;
  }
}
