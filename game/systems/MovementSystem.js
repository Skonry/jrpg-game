import randomNumber from '../utils/randomNumber'; 

export default class MovementSystem {
  update = ({ entities, systems }) => {
    const currentScene = systems.get('sceneSystem').currentScene;

    if (currentScene) return;

    entities.forEach(entity => {
      if (!entity.components.has('movementComponent')) return;

      const movementComponent = entity.components.get('movementComponent');

      if (!movementComponent.canMove) return;

      const inputSystem = systems.get('inputSystem');

      const positionComponent = entity.components.get('positionComponent');

      const currentLevel = systems.get('levelSystem').currentLevel;

      if (!currentLevel) return;

      let movementDirection = null;

      if (entity.class === 'player') {
        movementDirection = this.#getPlayerMovementDirection(inputSystem);
      }
      else if (entity.class === 'npc') {
        movementDirection = this.#getNpcMovementDirection();
      }

      movementComponent.movementDirection = movementDirection;

      movementComponent.lastMoveX = positionComponent.x;

      movementComponent.lastMoveY = positionComponent.y;

      if (movementDirection) {
        movementComponent.lastMovementDirection = movementDirection;
      }

      if (movementDirection === 'up') {
        if (positionComponent.y < 0) {
          movementComponent.canMoveUp = false;
          movementComponent.isMoving = false;
        }
        else {
          positionComponent.y -= movementComponent.movementSpeed;

          movementComponent.isMoving = true;
        }
      }
      else if (movementDirection === 'down') {
        if (positionComponent.y + positionComponent.height + 20 > currentLevel.mapHeight) {
          movementComponent.canMoveDown = false;
          movementComponent.isMoving = false;
        }
        else {
          positionComponent.y += movementComponent.movementSpeed;

          movementComponent.isMoving = true;
        }
      }
      else if (movementDirection === 'left') {
        if (positionComponent.x < 0) {
          movementComponent.canMoveLeft = false;
          movementComponent.isMoving = false;
        }
        else {
          positionComponent.x -= movementComponent.movementSpeed;

          movementComponent.isMoving = true;
        }
      }
      else if (movementDirection === 'right') {
        if (positionComponent.x + positionComponent.width > currentLevel.mapWidth) {
          movementComponent.canMoveRight = false;
          movementComponent.isMoving = false;
        }
        else {
          positionComponent.x += movementComponent.movementSpeed;

          movementComponent.isMoving = true;
        }
      }
      else { 
        movementComponent.isMoving = false;
      }
    });
  }

  #getPlayerMovementDirection = inputSystem => {
    if (inputSystem.keyboard.arrowLeft.isDown) {
      return 'left';
    }
    else if (inputSystem.keyboard.arrowRight.isDown) {
      return 'right';
    }
    else if (inputSystem.keyboard.arrowUp.isDown) {
      return 'up';
    }
    else if (inputSystem.keyboard.arrowDown.isDown) {
      return 'down';
    }
    
    return null;
  }

  #getNpcMovementDirection = () => {
      //if (this.game.stateManager.currentLevel === null) return;
      //if (this.game.stateManager.currentLevel.activDialogBox && this.game.stateManager.currentLevel.activDialogBox.isActiv) {
      //  return;
    //  }

    let rand = randomNumber(5);

    if (rand === 0) {
      return 'left';
    }
    else if (rand === 1) {
      return 'right';
    }
    else if (rand === 2) {
      return 'up';
    }
    else if (rand === 3) {
      return 'down';
    }
    else {
      return null
    }
  }
}
