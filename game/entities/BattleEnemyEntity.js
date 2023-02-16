import FightAnimationComponent from "../components/FightAnimationComponent";
import FightStatisticsComponent from "../components/FightStatisticsComponent";
import FightStatusesComponent from "../components/FightStatusesComponent";
import SpriteComponent from "../components/SpriteComponent";
import Entity from "./Entity";
import randomNumber from '../utils/randomNumber';

export default class BattleEnemyEntity extends Entity {
  constructor(name, x, y, width, height, spriteSource, layerName, childRelations) {
    const components = [
      [
        'spriteComponent',
        new SpriteComponent(x, y, width, height, spriteSource, layerName)
      ],
      [
        'fightStatisticsComponent',
        new FightStatisticsComponent({
          maxHealthPoints: 200,
          currentHealthPoints: 200,
          maxManaPoints: 200,
          currentManaPoints: 200,
          maxPowerPoints: 200,
          currentPowerPoints: randomNumber(200),
          strenght: 15,
          armorPoints: 0
        })
      ],
      [
        'fightStatusesComponent',
        new FightStatusesComponent()
      ],
      [
        'fightAnimationComponent',
        new FightAnimationComponent()
      ]
    ];

    super(name, 'battleEnemy', components, childRelations)
  }
}
