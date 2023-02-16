export default class SpriteSheetSystem {
  update = ({ entities, systems }) => {
    entities.forEach(entity => {
      const currentScene = systems.get('sceneSystem').currentScene;

      if (currentScene) return;

      if (!entity.components.has('spriteSheetComponent')) return;

      const spriteSheetComponent = entity.components.get('spriteSheetComponent');

      const movementComponent = entity.components.get('movementComponent');

      const positionComponent = entity.components.get('positionComponent');
      
      if (spriteSheetComponent.runAnimationOnlyOnMovement) {
        if (movementComponent.isMoving) {
          this.tickSpriteSheet(spriteSheetComponent);
        }
      } 
      else {
        this.tickSpriteSheet(spriteSheetComponent);
      }

      const layerContext = systems.get('renderSystem').layers.get(spriteSheetComponent.layerName).context;

      const spriteSheetRowNumber = spriteSheetComponent.directionToRowNumberMap[movementComponent.lastMovementDirection]

      layerContext.drawImage(
        spriteSheetComponent.image,
        spriteSheetComponent.currentFrame * spriteSheetComponent.frameWidth,
        spriteSheetRowNumber * spriteSheetComponent.frameHeight,
        spriteSheetComponent.frameWidth,
        spriteSheetComponent.frameHeight,
        positionComponent.x,
        positionComponent.y,
        positionComponent.width,
        positionComponent.height
      );
    });
  }
  
  tickSpriteSheet = component => {
    if (this.isTimeToChangeFrame(component)) {
      component.currentFrame = this.nextFrame(component);

      component.tickCounter = 0;
    }
    else {
      component.tickCounter++;
    }
  }

  isTimeToChangeFrame = component => component.tickCounter === component.frameDuration - 1;

  nextFrame = component => (component.currentFrame + 1) % component.spriteSheetRowLength;
}
