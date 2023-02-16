export default class FightStatisticsComponent {
  constructor({
    maxHealthPoints = 100, 
    currentHealthPoints = 100,
    maxManaPoints = 100, 
    currentManaPoints = 100, 
    maxPowerPoints = 100, 
    currentPowerPoints = 0, 
    strenght, 
    armorPoints 
  }) {
    this.maxHealthPoints = maxHealthPoints;
    this.currentHealthPoints = currentHealthPoints;
    this.maxManaPoints = maxManaPoints;
    this.currentManaPoints = currentManaPoints;
    this.maxPowerPoints = maxPowerPoints;
    this.currentPowerPoints = currentPowerPoints;
    this.strenght = strenght;
    this.armorPoints = armorPoints;
  }
}
