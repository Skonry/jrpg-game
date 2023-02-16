export default class SpriteComponent {
  x = 0;
  y = 0;
  width = 50;
  height = 50;
  sprite = null;

  constructor(x, y, width, height, spriteSrc, layerName) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.sprite = new Image();
    this.sprite.src = spriteSrc;
    this.layerName = layerName;
  }
}
