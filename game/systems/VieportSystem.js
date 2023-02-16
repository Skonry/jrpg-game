export default class VieportSystem {
  update = ({ systems, entities, events }) => {
    const currentScene = systems.get('sceneSystem').currentScene;

    if (currentScene) return;
    
    const renderSystem = systems.get('renderSystem');

    const event = events.get('setPlayerPositionOnLevel');

    if (event) {
      renderSystem.translateLayer('Layer', 960 / 2 - event.x, 690 / 2 - event.y);
    }

    if (!entities.has('player')) return;

    const playerMovementComponent = entities.get('player').components.get('movementComponent');

    if (!playerMovementComponent.isMoving) return;

    if (playerMovementComponent.movementDirection === 'up') {
      renderSystem.translateLayer('Layer', 0, playerMovementComponent.movementSpeed)
    }
    else if (playerMovementComponent.movementDirection === 'down') {
      renderSystem.translateLayer('Layer', 0, -playerMovementComponent.movementSpeed)
    }
    else if (playerMovementComponent.movementDirection === 'left') {
      renderSystem.translateLayer('Layer', playerMovementComponent.movementSpeed, 0)
    }
    else if (playerMovementComponent.movementDirection === 'right') {
      renderSystem.translateLayer('Layer', -playerMovementComponent.movementSpeed, 0)
    }
  }
}
