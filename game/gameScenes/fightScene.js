import BattleEnemyEntity from "../entities/BattleEnemyEntity";
import BattlePointerEntity from "../entities/BattlePointerEntity";
import ButtonEntity from "../entities/ButtonEntity";
import ProgressBarEntity from "../entities/ProgressBarEntity";
import SpriteEntity from "../entities/SpriteEntity";

export default {
  init({ systems, addEntity, entities }) {
    this.name = 'fightScene';

    this.alpha = 0;

    this.floatingTexts = [];

    const renderSystem = systems.get('renderSystem');

    renderSystem.addCanvasLayer('Background');

    renderSystem.addCanvasLayer('Characters');

    renderSystem.addCanvasLayer('HUDLayer');

    renderSystem.addCanvasLayer('HUDLayer2');

    renderSystem.addCanvasLayer('HUDLayer3');

    renderSystem.addCanvasLayer('FloatingTexts');

    const encounter = systems.get('randomEncounterSystem').generatedEncounter;

    addEntity(
      'escapeButton',
      new ButtonEntity('escapeButton', 40, 590, 160, 80, 'img/buttons/btn_escape.png', 'HUDLayer')
    );

    addEntity(
      'battleBackground',
      new SpriteEntity('battleBackground', 0, 0, 1000, 1000, encounter.battleBackground, 'Background')
    );

    addEntity(
      'playerHealthBar',
      new ProgressBarEntity('playerHealthBar', 20, 80, 300, 50, 5, 'img/health.png', 'img/health_bar.png', 'HUDLayer')
    );

    addEntity(
      'playerManaBar',
      new ProgressBarEntity('playerManaBar', 20, 140, 300, 50, 5, 'img/mana.png', 'img/mana_bar.png', 'HUDLayer')
    );

    addEntity(
      'playerPowerBar',
      new ProgressBarEntity('playerPowerBar', 20, 200, 300, 50, 5, 'img/power.png', 'img/power_bar.png', 'HUDLayer')
    );

    addEntity(
      'playerBattleSprite',
      new SpriteEntity('playerBattleSprite', 100, 400, 100, 100, 'img/hero.png', 'Characters')
    )

    for (let i = 0; i < encounter.numberOfEnemies; i++) {
      const enemyName = `enemy${i}`;

      const barName = `enemyHealthBar${enemyName}`;

      const barXPosition = 600;

      const barYPosition = 300 + 100 * i;

      const enemyXPosition = barXPosition;

      const enemyYPosition = barYPosition + 10;

      addEntity(
        enemyName,
        new BattleEnemyEntity(
          enemyName, 
          enemyXPosition, 
          enemyYPosition, 
          100, 
          100, 
          encounter.monsterData.sprite, 
          'Characters',
          [
            ['healthBar', barName]
          ]
        )
      )

      addEntity(
        barName,
        new ProgressBarEntity(
          barName, 
          barXPosition, 
          barYPosition,
          150, 
          25,
          2,
          'img/health.png', 
          'img/health_bar.png', 
          'HUDLayer'
        )
      )
    }

    addEntity(
      'battlePointer',
      new BattlePointerEntity(630, 305, 'HUDLayer')
    );

    const playerBattleSkillsComponent = entities.get('player').components.get('battleSkillsComponent');

    playerBattleSkillsComponent.skills.forEach(skill => {
      const buttonName = `${skill.name}Button`;

      addEntity(
        buttonName, 
        new SpriteEntity(
          buttonName, 
          40, 
          10 + skill.id * 50, 
          50, 
          50, 
          `img/skills/battleskill0${skill.id + 1}.png`, 
          'HUDLayer'
        )
      );
    });

    //this.game.player.fightStatistics.calculateArmorPoints();
  },

  dispose({ entities, removeEntity }) {
    removeEntity('escapeButton');

    removeEntity('battleBackground');

    removeEntity('playerHealthBar');

    removeEntity('playerManaBar');

    removeEntity('playerPowerBar');

    removeEntity('playerBattleSprite');

    removeEntity('battlePointer');

    const playerBattleSkillsComponent = entities.get('player').components.get('battleSkillsComponent');

    playerBattleSkillsComponent.skills.forEach(skill => {
      const buttonName = `${skill.name}Button`;

      removeEntity(buttonName);
    });

    const enemies = Array.from(entities.values()).filter(entity => entity.class === 'battleEnemy');

    enemies.forEach(enemy => removeEntity(enemy.name));

    this.floatingTexts = [];
  },

  update() {

  }
}
