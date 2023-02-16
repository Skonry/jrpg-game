import items from './data/itemsData.js';
import lootTables from './data/lootTables.js';
import monstersData from './data/monstersData.js';

export default class DataSystem {
  #items = items;
  #lootTables = lootTables;
  #monsters = monstersData;
  #storage = new Map();

  readFromStorage = key => this.#storage.get(key);

  saveToStorage = (key, value) => this.#storage.set(key, value);

  getItemData = id => this.#items.find(item => item.id === id);
    
  getMonsterData = monsterName => this.#monsters[monsterName];

  getLootTable = playerLevel => this.#lootTables[playerLevel];
}