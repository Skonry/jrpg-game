import EquipmentEnity from "../../entities/EquipmentEntity";
import pointInsideRectangle from "../../utils/pointInsideRectangle";
import InventoryItem from "./InventoryItem";
import EquipmentItem from "./EquipmentItem";

export default class EquipmentSystem {
  #equipedItems = [];

  #inventoryItems = [];
  
  #grabbingOperation = null;

  #hoveredItem = null;

  #isOpen = false;

  #hoveredItemBackground = new Image();
  
  constructor() {
    this.#hoveredItemBackground.src = 'img/item_bg.png';
  }

  get inventoryItems() { 
    this.#inventoryItems;
  }

  set inventoryItems(items) {
    this.#inventoryItems = items;
  }

  get equipedItems() {
    this.#equipedItems;
  }

  set equipedItems(items) {
    this.#equipedItems = items;
  }

  init = ( { systems, addEntity, removeEntity } ) => {
    const inputSystem = systems.get('inputSystem');

    inputSystem.subscribeSignal('iDown', () => {
      if (this.#isOpen) {
        this.#isOpen = false;

        removeEntity('equipment');
      }
      else {
        this.#isOpen = true;

        addEntity('equipment', new EquipmentEnity('equipment'));
      }
    });
  }

  update = ({ systems, entities, events }) => {
    const inputSystem = systems.get('inputSystem');

    const dataSystem = systems.get('dataSystem');

    const consoleSystem = systems.get('consoleSystem');

    const renderSystem = systems.get('renderSystem');

    const equipment = entities.get('equipment');

    const player = entities.get('player');

    const addItemToInventoryEvent = events.get('addItemToInventory');

    if (addItemToInventoryEvent) this.#addItemToInventory(addItemToInventoryEvent, dataSystem, consoleSystem);

    const removeItemFromInventoryEvent = events.get('removeItemFromInventory');

    if (removeItemFromInventoryEvent) this.#removeItemFromInventory(removeItemFromInventoryEvent, dataSystem);

    if (!equipment) return;

    this.#processDoubleClickInput(inputSystem, equipment, player, consoleSystem);

    this.#processMouseMoveInput(inputSystem, equipment);

    this.#processMouseDownInput(inputSystem, equipment);

    this.#processMouseUpInput(inputSystem, equipment, consoleSystem);

    this.#draw(renderSystem, inputSystem, equipment);
  }

  serialize = () => {
    return {
      equipedItems: this.#equipedItems,
      inventoryItems: this.#inventoryItems
    }
  }

  #draw = (renderSystem, inputSystem, equipment) => {
    const inventoryGridComponent = equipment.components.get('inventoryGridComponent');

    const equipmentSlotsComponent = equipment.components.get('equipmentSlotsComponent');

    const layerContext = renderSystem.layers.get('HUDLayer2').context;

    if (this.#hoveredItem) {
      const y = inputSystem.mouse.y;

      let x = inputSystem.mouse.x;
      if (x - 130 < 0) {
        x = 130;
      }
      if (x > 830) {
        x = 830;
      }

      layerContext.globalAlpha = 0.7;

      layerContext.drawImage(this.#hoveredItemBackground, x - 110, y + 40);

      layerContext.fillText('Name: ' + this.#hoveredItem.name, x - 105, y + 60);

      layerContext.fillText('Typ: ' + this.#hoveredItem.type, x - 105, y + 80);

      layerContext.fillText('Cena: ' + this.#hoveredItem.value, x - 105, y + 100);

      layerContext.fillText('Bonus: ' + this.#hoveredItem.bonus, x - 105, y + 120);

      layerContext.globalAlpha = 1;
    }

    this.#inventoryItems.forEach(item => {
      if (item.isFloating) {
        layerContext.drawImage(item.sprite, inputSystem.mouse.x - 30, inputSystem.mouse.y - 30, 80, 80);
      }
      else {
        const slot = inventoryGridComponent.slots[item.slotIndex];

        layerContext.drawImage(item.sprite, slot.x, slot.y, 60, 60);

        if (item.isStackable) {
          layerContext.save();

          layerContext.fillStyle = 'rgb(0,0,0)';

          layerContext.fillText(`x${item.stackAmount}`, slot.x, slot.y + 55);

          layerContext.restore();
        }
      }
    });

    this.#equipedItems.forEach(item => {
      const slot = equipmentSlotsComponent[`${item.type}Slot`];

      if (item.isFloating) {
        layerContext.drawImage(item.sprite, inputSystem.mouse.x - 30, inputSystem.mouse.y - 30, 60, 60);
      }
      else {
        layerContext.drawImage(item.sprite, slot.x, slot.y, 60, 60);
      }
    });
  }

  #addItemToInventory = (event, dataSystem, consoleSystem) => {
    const itemData = dataSystem.getItemData(event.itemId);

    if (itemData.isStackable) {
      const foundItem = this.#inventoryItems.find(item => item.id === itemData.id);
  
      if (foundItem)  {
        foundItem.numberOfStacks++;

        consoleSystem.addMessage('Dodano ' + itemData.name + ' do ekwipunku');

        return;
      }
    }

    let emptySlotIndex = -1;

    for (let i = 0; i < 20; i++) {
      const foundItem = this.#inventoryItems.find(item => item.inventoryIndex === i);

      if (!foundItem) {
        emptySlotIndex = i;

        break;
      }
    }

    if (emptySlotIndex >= 0) {
      consoleSystem.addMessage('Dodano ' + itemData.name + ' do ekwipunku');

      this.#inventoryItems.push(new InventoryItem(itemData, emptySlotIndex));
    }
    else {
      consoleSystem.addMessage('Brak miejsca w ekwipunku!');
    }
  }

  #removeItemFromInventory = (event, dataSystem) => {
    const itemData = dataSystem.getItemData(event.itemId);

    const foundItem = this.#inventoryItems.find(item => item.id === itemData.id);

    if (itemData.isStackable && foundItem.numberOfStacks > 1) {
      foundItem.numberOfStacks--;
    }
    else {
      this.#inventoryItems = this.#inventoryItems.filter(item => item.id !== itemData.id);
    }
  }

  #processDoubleClickInput = (inputSystem, equipment, player, consoleSystem) => {
    if (!this.isOpen) return;

    if (!inputSystem.inputsToProcess.has('doubleClick')) return;

    const { x, y } = inputSystem.inputsToProcess.get('doubleClick');

    const inventoryGridComponent = equipment.components.get('inventoryGridComponent');

    const fightStatisticsComponent = player.components.get('fightStatisticsComponent');

    this.#checkIfHealthPotionWasClicked(inventoryGridComponent, x, y, fightStatisticsComponent, consoleSystem);

    this.#checkIfManaPotionWasClicked(inventoryGridComponent, x, y, fightStatisticsComponent, consoleSystem);
  }

  #checkIfHealthPotionWasClicked(inventoryGridComponent, x, y, fightStatisticsComponent, consoleSystem) {
    const healthPotion = this.#inventoryItems.find(item => item.type === 'potion_health');

    if (!healthPotion) return;

    const slot = inventoryGridComponent.slots[healthPotion.slotIndex];

    if (!pointInsideRectangle(x, y, slot)) return;

    let hpBonus = healthPotion.bonus;

    let fullRecover = '';

    if (fightStatisticsComponent.currentHealthPoints > fightStatisticsComponent.maxHealthPoints) {
      hpBonus = fightStatistics.maxHealthPoints + hpBonus - fightStatistics.currentHealthPoints;

      fullRecover = 'Jesteś już w pełni zdrowia!';
    }

    fightStatistics.currentHealthPoints += hpBonus;

    if (healthPotion.stackAmount > 1) {
      healthPotion.stackAmount--;
    }
    else {
      this.#inventoryItems = this.#inventoryItems.filter(item => item.id !== healthPotion.id);
    }
  }

  #checkIfManaPotionWasClicked = () => {
    const manaPotion = this.#inventoryItems.find(item => item.type === 'potion_mana');

    if (!manaPotion) return;

    const slot = inventoryGridComponent.slots[manaPotion.slotIndex];

    if (!pointInsideRectangle(x, y, slot)) return;

    let manaBonus = manaPotion.bonus;

    let fullMana = '';

    if (fightStatisticsComponent.currentManaPoints > fightStatisticsComponent.maxManaPoints) {
      manaBonus = fightStatistics.maxManaPoints + hpBonus - fightStatistics.currentManaPoints;

      fullMana = 'Twój zasób many jest już pełny!';
    }

    fightStatistics.currentManaPoints += manaBonus;

    if (manaPotion.stackAmount > 1) {
      manaPotion.stackAmount--;
    }
    else {
      this.#inventoryItems = this.#inventoryItems.filter(item => item.id !== manaPotion.id);
    }
  }

  #processMouseMoveInput = (inputSystem, equipment) => {
    if (!equipment) return;

    const { x, y } = inputSystem.mouse;

    const inventoryGridComponent = equipment.components.get('inventoryGridComponent');

    const equipmentSlotsComponent = equipment.components.get('equipmentSlotsComponent');

    this.#inventoryItems.forEach(item => {
      const slot = inventoryGridComponent.slots[item.slotIndex];

      if (pointInsideRectangle(x, y, slot)) {
        this.#hoveredItem = item;

        return;
      }
    });

    this.#equipedItems.forEach(item => {
      console.log(item);
      console.log(equipmentSlotsComponent)
      const slot = equipmentSlotsComponent[`${item.type}Slot`];

      if (pointInsideRectangle(x, y, slot)) {
        this.#hoveredItem = item;

        return;
      }
    });

    this.#hoveredItem = null;
  }

  #processMouseDownInput = (inputSystem, equipment) => {
    if (!inputSystem.inputsToProcess.has('mouseDown')) return;

    const { x, y } = inputSystem.inputsToProcess.get('mouseDown');

    const inventoryGridComponent = equipment.components.get('inventoryGridComponent');

    const equipmentSlotsComponent = equipment.components.get('equipmentSlotsComponent');

    this.#inventoryItems.forEach(item => {
      const slot = inventoryGridComponent.slots[item.slotIndex];

      if (pointInsideRectangle(x, y, slot)) {
        this.#grabbingOperation = { from: 'inventory', item: item };

        item.isFloating = true;

        return;
      }
    });

    this.#equipedItems.forEach(item => {
      const slot = equipmentSlotsComponent[`${item.type}Slot`];

      if (pointInsideRectangle(x, y, slot)) {
        this.#grabbingOperation = { from: 'equipment', item: item };

        item.isFloating = true;

        return;
      }
    });
  }

  #processMouseUpInput = (inputSystem, equipment, consoleSystem) => {
    if (!inputSystem.inputsToProcess.has('mouseUp')) return;

    if (this.#grabbingOperation === null) return;

    const { x, y } = inputSystem.inputsToProcess.get('mouseUp');

    const inventoryGridComponent = equipment.components.get('inventoryGridComponent');

    const equipmentSlotsComponent = equipment.components.get('equipmentSlotsComponent');

    if (this.#grabbingOperation.from === 'inventory') {
      equipmentSlotsComponent.slots.forEach(slot => {
        if (pointInsideRectangle(x, y, slot)) {
          if (this.#equipedItems.find(item => item.type === slot.type)) {
            consoleSystem.addMessage('This slot is not empty');
          }
          else {
            const movedItem = this.#inventoryItems.find(item => item.isFloating);

            if (movedItem.type !== slot.type) {
              consoleSystem.addMessage('Item do not match slot type');
            }
            else {
              this.#inventoryItems = this.#inventoryItems.filter(item => item.id !== movedItem.id);

              this.#equipedItems.push(new EquipmentItem(movedItem, slot.type));
            }
          }
        }
      });
    }
    
    else if (this.#grabbingOperation.from === 'equippedItems') {
      inventoryGridComponent.slots.forEach((slot, i) => {
        if (pointInsideRectangle(x, y, slot)) {
          if (this.#inventoryItems.find(item => item.slotIndex === i)) {
            consoleSystem.addMessage('This slot is not empty');
          }
          else {
            const movedItem = this.#equipedItems.find(item => item.isFloating);

            this.#equipedItems = this.#equipedItems.filter(item => item.id !== movedItem.id);

            this.#inventoryItems.push(new InventoryItem(movedItem, i));
          }
        }
      });
    }
    
    this.#grabbingOperation.item.isFloating = false;

    this.#grabbingOperation = null;
  }
}
