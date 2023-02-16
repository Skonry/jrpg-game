export default class FightStatisticsSystem {
  #sprite = new Image();
  #isOpen = false;
  #statistics = new Map();

  constructor() {
    this.#sprite.src = 'img/statystyki.png';
  }

  init = ({ systems }) => {
    const inputSystem = systems.get('inputSytem');

    inputSystem.subscribeSignal('cDown', this.#toggle);
  }

  update({ systems, entities }) {
    if (!this.#isOpen) return;

    const HUDLayer = systems.get('rendererSystem').getLayers().get('HUDLayer');

    HUDLayer.drawImage(this.sprite, 50, 120, 400, 550);
    HUDLayer.fillStyle = 'rgb(255,255,255)';
    HUDLayer.fillText('Poziom Postaci:  ' + this.game.player.level, 70, 240);
    HUDLayer.fillText('Punkty Doświadczenia:  ' + this.game.player.exp, 70, 280);
    HUDLayer.fillText(
      'Punkty Życia:  ' + this.statistics.currentHealthPoints + '/' + this.statistics.maxHealthPoints,
      70,
      320
    );
    HUDLayer.fillText(
      'Punkty Magii:  ' + this.statistics.currentManaPoints + '/' + this.statistics.maxManaPoints,
      70,
      360
    );
    HUDLayer.fillText('Siła:  ' + this.statistics.strenght, 70, 400);
    HUDLayer.fillText('Pancerz:  ' + this.statistics.armorPoints, 70, 440);
  }
  
  #toggle = () =>  {
    this.#isOpen = !this.#isOpen;

    const movementComponent = playerEntity.components.get('movementComponent')

    movementComponent.canMove = !this.#isOpen;

    this.#calculateArmorPoints();
  }
  
  #calculateArmorPoints = () => {
    let armor = 0;
    for (let i = 0; i < this.player.equipment.equippedItemsSlots.length; i++) {

      if (i === 3) {
        continue;
      }
      if (this.player.equipment.equippedItemsSlots[i].item) {
        armor += this.player.equipment.equippedItemsSlots[i].item.bonus;
      }
    }
    this.statistics.armorPoints = armor;
    return armor;
  }
}
