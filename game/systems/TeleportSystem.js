import TeleportEntity from '../entities/TeleportEntity';

export default class TeleportSystem {
  #popup = new Image();

  constructor() {
    this.#popup.src = 'img/dialogbox.png';
  }

  createTeleport = (name, x, y, destinationLevelName, destinationLevelX, destinationLevelY, layerName) => {
    return new TeleportEntity(name, x, y, destinationLevelName, destinationLevelX, destinationLevelY, layerName)
  }

  update = ({ systems, entities, events }) => {
    const inputSystem = systems.get('inputSystem');

    const collisionSystem = systems.get('collisionSystem');

    const levelSystem = systems.get('levelSystem');

    const renderSystem =  systems.get('renderSystem')

    const teleportEntities = Array.from(entities.values()).filter(v => v.class === 'teleport')

    const playerEnity = entities.get('player');

    const collidedTeleport = collisionSystem.someCollide(playerEnity, teleportEntities)

    if (inputSystem.keyboard.space.isDown && collidedTeleport) {
      events.set('requestedLevelChange', collidedTeleport.components.get('teleportDestinationComponent'))
    }

    if (collidedTeleport) {
      const HUDLayerContext = renderSystem.layers.get('HUDLayer').context;
      
      HUDLayerContext.font = '25px Georgia';

      HUDLayerContext.drawImage(this.#popup, 225, 20, 520, 150);

      const destinationLevelName = collidedTeleport.components.get('teleportDestinationComponent').levelName

      const text = 'Chcesz przenieś się do: ' + destinationLevelName + '?';

      const xPos = (520 - HUDLayerContext.measureText(text).width) / 2 + 225;

      HUDLayerContext.fillStyle = 'white';

      HUDLayerContext.fillText(text, xPos, 75);

      HUDLayerContext.fillText('<Spacja>', 440, 130);
    }

    teleportEntities.forEach(teleport => {
      const component = teleport.components.get('spriteComponent');

      const layerContext = renderSystem.layers.get(component.layerName).context;

      layerContext.drawImage(component.sprite, component.x, component.y, component.width, component.height);
    });
  }
}
