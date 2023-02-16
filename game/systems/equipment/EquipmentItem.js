export default class EquipmentItem {
  constructor(itemData, type) {
    this.id = itemData.id;
    this.type = type;
    this.spriteSrc = itemData.spriteSrc;
    this.sprite = new Image();
    this.sprite.src = itemData.spriteSrc;
    this.isFloating;
  }
}
