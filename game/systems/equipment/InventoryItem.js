export default class InventoryItem {
  constructor(itemData, emptySlotIndex) {
    this.id = itemData.id;
    this.isStackable = itemData.isStackable;
    this.spriteSrc = itemData.spriteSrc;
    this.sprite = new Image();
    this.sprite.src = itemData.spriteSrc;
    this.type = itemData.type;
    this.numberOfStacks = 1;
    this.slotIndex = emptySlotIndex;
    this.isFloating;
  }
}
