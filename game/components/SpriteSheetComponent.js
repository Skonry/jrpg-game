export default class SpriteSheetComponent {
  constructor(
    layerName, 
    fileSrc, 
    frameWidth, 
    frameHeight, 
    frameDuration, 
    directionToRowNumberMap = { down: 0, left: 1, right: 2, up: 3 }, 
    runAnimationOnlyOnMovement = true
  ) {
    this.layerName = layerName;
    this.image = new Image();
    this.image.src = fileSrc;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.frameDuration = frameDuration;
    this.directionToRowNumberMap = directionToRowNumberMap;
    this.runAnimationOnlyOnMovement = runAnimationOnlyOnMovement;
    this.currentFrame = 0;
    this.tickCounter = 0;
    this.image.addEventListener(
      'load', 
      () => this.spriteSheetRowLength = Math.floor(this.image.width / frameWidth)
    );
  }
}
