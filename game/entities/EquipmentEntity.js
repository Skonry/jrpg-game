import EquipmentSlotsComponent from "../components/EquipmentSlotsComponent";
import InventoryGridComponent from "../components/InventoryGridComponent";
import SpriteComponent from "../components/SpriteComponent";
import Entity from "./Entity";

export default class EquipmentEnity extends Entity {
  constructor(name, x = 600, y = 100, width = 300, height = 500, xInnerPadding = 8, yInnerPadding = 220) {
    const components = [
      [
        'inventoryGridComponent',
        new InventoryGridComponent(
          x, 
          y, 
          xInnerPadding, 
          yInnerPadding, 
          { width: 64, height: 64, margin: 6, rowsNumber: 4, columnsNumber: 4 }
        )
      ],
      [
        'spriteComponent',
        new SpriteComponent(x, y, width, height, 'img/eq.png', 'HUDLayer')
      ],
      [
        'equipmentSlotsComponent',
        new EquipmentSlotsComponent()
      ]
    ];

    super(name, 'equipment', components);
  }
}
