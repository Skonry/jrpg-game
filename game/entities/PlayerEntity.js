import SpriteSheetComponent from '../components/SpriteSheetComponent';
import ExperiencePointsComponent from '../components/ExperiencePointsComponent';
import MovementComponent from '../components/MovementComponent';
import Entity from "./Entity";
import FightStatisticsComponent from '../components/FightStatisticsComponent';
import GoldComponent from '../components/GoldComponent';
import PositionComponent from '../components/PositionComponent';
import BattleSkillsComponent from '../components/BattleSkillsComponent';
import FightStatusesComponent from '../components/FightStatusesComponent';
import FightAnimationComponent from '../components/FightAnimationComponent';
import SerializationComponent from '../components/SerializationComponent';
import randomNumber from '../utils/randomNumber';

export default class PlayerEntity extends Entity {
  constructor(playerName, gender) {
    const loadCallback = (state) => {
      this.name = state.name;
  
      this.gender = state.gender;
  
      const positionComponent = this.components.get('positionComponent');
  
      const fightStatisticsComponent = this.components.get('fightStatisticsComponent');
  
      const goldComponent = this.components.get('goldComponent');
  
      const experiencePointsComponent = this.components.get('experiencePointsComponent');
  
      positionComponent.x = parseInt(state.positionX, 10);
  
      positionComponent.y = parseInt(state.positionY, 10);
  
      fightStatisticsComponent.maxHealthPoints = state.fightStatistics.maxHealthPoints;
      fightStatisticsComponent.currentHealthPoints = state.fightStatistics.currentHealthPoints;
      fightStatisticsComponent.maxManaPoints = state.fightStatistics.maxManaPoints;
      fightStatisticsComponent.currentManaPoints = state.fightStatistics.currentManaPoints;
      fightStatisticsComponent.maxPowerPoints = state.fightStatistics.maxPowerPoints;
      fightStatisticsComponent.currentPowerPoints = state.fightStatistics.currentPowerPoints;
      fightStatisticsComponent.armorPoints = state.fightStatistics.armorPoints;
      fightStatisticsComponent.strenght = state.fightStatistics.strenght;
     
      goldComponent.gold = parseInt(state.gold, 10);
  
      experiencePointsComponent.exp = parseInt(state.exp);
  
      experiencePointsComponent.level = parseInt(state.level);

      this.components.set(
        'spriteSheetComponent',
        new SpriteSheetComponent(
          'Layer', 
          this.gender === 'male' ? 'img/spritesheets/male01.png' : 'img/spritesheets/female01.png',
          32,
          48,
          10
        )
      );
    }

    const saveCallback = () => {
      const positionComponent = this.components.get('positionComponent');
  
      const fightStatisticsComponent = this.components.get('fightStatisticsComponent');
  
      const goldComponent = this.components.get('goldComponent');
  
      const experiencePointsComponent = this.components.get('experiencePointsComponent');
  
      return {
        name: this.playerName,
        gender: this.gender,
        positionX: positionComponent.x,
        positionY: positionComponent.y,
        fightStatistics: fightStatisticsComponent,
        gold: goldComponent.gold,
        exp: experiencePointsComponent.exp,
        level: experiencePointsComponent.level
      }
    }

    const components = [
      [
        'spriteSheetComponent',
        new SpriteSheetComponent(
          'Layer', 
          gender === 'male' ? 'img/spritesheets/male01.png' : 'img/spritesheets/female01.png',
          32,
          48,
          10
        )
      ],
      [
        'experiencePointsComponent',
        new ExperiencePointsComponent()
      ],
      [
        'movementComponent',
        new MovementComponent(7)
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
      ],
      [
        'goldComponent',
        new GoldComponent(100)
      ],
      [
        'positionComponent',
        new PositionComponent(300, 300, 50, 50)
      ],
      [
        'battleSkillsComponent',
        new BattleSkillsComponent(new Map([
          [
            'Basic Attack', 
            { id: 0, name: 'Basic Attack', manaCost: 0, description: 'Skill desctiption' }
          ]
        ]))
      ],
      [
        'serializationComponent',
        new SerializationComponent(saveCallback, loadCallback)
      ]
    ];

    super('player', 'player', components);

    this.playerName = playerName;
    this.gender = gender;
    this.isAlive = true;
  }
}
