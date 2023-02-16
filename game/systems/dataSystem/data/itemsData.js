export default [
  {
    id: 1, 
    name: 'Tasak', 
    type: 'weapon', 
    spriteSrc: 'img/items/tasak.png', 
    requirements: {strenght: 15},
    value: 100, 
    isStackable: false, 
    isPossibleToSell: true, 
    bonus: 35
  },
  {
    id: 2, 
    name: 'Mała Tarcza',
    type: 'shield', 
    spriteSrc: 'img/items/tarcza.png', 
    requirements: {strenght: 10},
    value: 50, 
    isStackable: false, 
    isPossibleToSell: true, 
    bonus: 15
  },
  {
    id: 3, 
    name:'Skórzane Buty', 
    type: 'boots', 
    spriteSrc: 'img/items/buty.png', 
    requirements: {strenght: 5},
    value: 20, 
    isStackable: false, 
    isPossibleToSell: true, 
    bonus: 5
  },
  {
    id: 4, 
    name: 'Mikstura zdrowia', 
    type: 'potion_health', 
    spriteSrc: 'img/items/health_potion.png', 
    requirements: {},
    value: 10, 
    isStackable: true, 
    isPossibleToSell: true, 
    bonus: 50
  },
  {
    id: 5, 
    name: 'Mikstura many', 
    type: 'potion_mana', 
    spriteSrc: 'img/items/mana_potion.png', 
    requirements: {},
    value: 10, 
    isStackable: true, 
    isPossibleToSell: true, 
    bonus: 20
  },
  {
    id: 6, 
    name: 'Wytrych', 
    type: 'lockpick', 
    spriteSrc: 'img/lockpick.png',
    requirements: {},
    value: 10, 
    isStackable: true, 
    isPossibleToSell: true, 
    bonus: 0
  },
  {
    id: 7, 
    name: 'Notatka', 
    type: 'note', 
    spriteSrc: 'img/note.png', 
    requirements: {},
    value: 0, 
    isStackable: false, 
    isPossibleToSell: false, 
    bonus: 0
  },
  {
    id: 8, 
    name: 'Kwiatek', 
    type: 'pickable', 
    spriteSrc: 'img/items/kwiatek.png', 
    requirements: {},
    value: 10, 
    isStackable: true, 
    isPossibleToSell: true, 
    bonus: 0
  }
]
