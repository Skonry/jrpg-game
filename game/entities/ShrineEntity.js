import SpriteComponent from "../components/SpriteComponent";
import PositionComponent from "../components/PositionComponent";
import Entity from "./Entity";

export default class ShrineEntity extends Entity {
  constructor(name, x, y) {
    const components = [
      [
        'spriteComponent',
        new SpriteComponent(x, y, 150, 200, 'img/kapliczka.png')
      ],
      [
        'positionComponent',
        new PositionComponent(x, y, 150, 200)
      ]
    ];

    super(name, 'shrine', components);
  }
}
