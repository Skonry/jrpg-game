import Entity from "./Entity";
import SpriteComponent from "../components/SpriteComponent";
import PositionComponent from "../components/PositionComponent";
import TeleportDestinationComponent from '../components/TeleportDestinationComponent';

export default class TeleportEntity extends Entity {
  constructor(name, x, y, destinationLevelName, destinationLevelX, destinationLevelY, layerName) {
    const components = [
      [
        'teleportDestinationComponent', 
        new TeleportDestinationComponent(destinationLevelName, destinationLevelX, destinationLevelY)
      ],
      [
        'spriteComponent', 
        new SpriteComponent(x, y, 100, 100, 'img/teleport.png', layerName)
      ],
      [
        'positionComponent',
        new PositionComponent(x, y, 100, 100)
      ]
    ];

    super(name, 'teleport', components);
  }
}
