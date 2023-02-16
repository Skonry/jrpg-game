export default class InventoryGridComponent {
  constructor(x, y, xInnerPadding, yInnerPadding, slotParameters) {
    this.xOfSlots = x + xInnerPadding;
    this.yOfSlots = y + yInnerPadding;
    this.slots = this.#createSlots(slotParameters);
  }

  #createSlots = (slotParameters) => {
    const itemSlots = [];

    let y = slotParameters.margin;

    for (let i = 0; i < slotParameters.columnsNumber; i++) {
      let x = slotParameters.margin;

      for (let j = 0; j < slotParameters.rowsNumber; j++) {
        let slot = {
          x: this.xOfSlots + x,
          y: this.yOfSlots + y,
          width: slotParameters.width,
          height: slotParameters.height,
        };

        x += slotParameters.width + slotParameters.margin;

        itemSlots.push(slot);
      }

      y += slotParameters.height + slotParameters.margin;
    }

    return itemSlots;
  } 
}
