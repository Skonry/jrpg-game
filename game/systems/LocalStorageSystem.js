import InventoryItem from "./equipment/InventoryItem";
import EquipmentItem from "./equipment/EquipmentItem";

export default class LocalStorageSystem {
  init = ({ game, entities, systems }) => {
    const timerSystem = systems.get('timerSystem');

    timerSystem.createInteval(
      'saveGameStateTimer',
      1000 * 10,
      () => this.#saveState(game.entities, game.systems)
    );
  }

  readFromLocalStorage = key => localStorage.get(key);

  loadState = (entities, systems) => {
    const loadedData = localStorage.getItem('gameState');

    if (!loadedData) return;

    const gameState = JSON.parse(loadedData)

    entities.forEach(entity => {
      const component = entity.components.get('serializationComponent');

      if (!component) return;

      component.loadCallback(gameState[entity.name]);
    });

    const equipmentSystem = systems.get('equipmentSystem');

    equipmentSystem.inventoryItems = gameState.equipmentSystem.inventoryItems.map((item, i) => {
      return new InventoryItem(item, i);
    })

    equipmentSystem.equipedItems = gameState.equipmentSystem.equipedItems.map(item => {
      return new EquipmentItem(item, `${item.type}`);
    });
  } 

  #saveState = (entities, systems) => {
    const sceneSystem = systems.get('sceneSystem');

    if (sceneSystem.currentScene) return;

    const entitiesState = Array.from(entities.entries()).reduce((state, [key, value]) => {
      const component = value.components.get('serializationComponent');

      if (!component) return state;

      const entityState = component.saveCallback();

      return { ...state, [key]: entityState };
    }, {});

    const equipmentSystem = systems.get('equipmentSystem');

    const systemsState = {
      equipmentSystem: equipmentSystem.serialize()
    }

    const jsonData = JSON.stringify({ ...entitiesState, ...systemsState });

    localStorage.setItem('gameState', jsonData);

    const consoleSystem = systems.get('consoleSystem');

    consoleSystem.addMessage('Game state saved');
  }
}
