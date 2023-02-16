import pointInsideRectangle from '../utils/pointInsideRectangle';
import throttleProperty from '../utils/throttleProperty';
import randomNumber from '../utils/randomNumber';

export default class FightSystem {
  canChangeTarget = true;

  #currentPointerTargetIndex = 0;

  constructor() {
    this.skillDescriptionBg = new Image();

    this.skillDescriptionBg.src = 'img/item_bg.png';
  }

  update = ({ systems, entities, registerEvent, removeEntity }) => {
    const currentSceneName = systems.get('sceneSystem').currentSceneName();

    if (currentSceneName !== 'fightScene') return;

    const consoleSystem = systems.get('consoleSystem');

    const renderSystem = systems.get('renderSystem');

    const floatingTextsSystem = systems.get('floatingTextsSystem');

    const randomEncounterSystem = systems.get('randomEncounterSystem');

    const dataSystem = systems.get('dataSystem');

    const levelSystem = systems.get('levelSystem');

    const player = entities.get('player');

    const playerBattleSprite = entities.get('playerBattleSprite');

    const playerFightStatisticsComponent = player.components.get('fightStatisticsComponent');

    if (playerFightStatisticsComponent.currentHealthPoints < 1) {
      this.#loseEncounter(consoleSystem, player, registerEvent, dataSystem);

      return;
    }

    const enemies = Array.from(entities.values()).filter(entity => entity.class === 'battleEnemy');

    if (enemies.length === 0) {
      this.#winEncounter(randomEncounterSystem, consoleSystem, player, registerEvent, dataSystem, levelSystem);

      return;
    }

    const inputSystem = systems.get('inputSystem');

    this.#processClick(
      inputSystem, 
      consoleSystem, 
      registerEvent, 
      entities, 
      player, 
      floatingTextsSystem, 
      removeEntity,
      levelSystem
    );

    this.#processMouseMovement(inputSystem, renderSystem, entities, player);

    this.#processKeyboardInput(inputSystem, enemies.length);

    this.#updatePlayerPowerPoints(player);

    this.#updateEnemiesPowerPoints(entities);

    this.#enemiesAttacks(consoleSystem, player, floatingTextsSystem, entities);

    this.#drawPlayer(player, entities, renderSystem, playerBattleSprite);

    this.#drawEnemies(entities, renderSystem);
  }

  #winEncounter = (randomEncounterSystem, consoleSystem, player, registerEvent, dataSystem, levelSystem) => {
    const expPoints = randomEncounterSystem.generatedEncounter.experiencePoints;

    const fightAnimationComponent = player.components.get('fightAnimationComponent');

    fightAnimationComponent.reset();

    consoleSystem.addMessage('Zwycięstwo! Zdobyto ' + expPoints + ' punktów doświadczenia.');

    const experiencePointsComponent = player.components.get('experiencePointsComponent');

    experiencePointsComponent.exp += expPoints;

    const rand = randomNumber(1000) + 1;

    const lootTable = dataSystem.getLootTable(experiencePointsComponent.level);

    const loot = lootTable.find(loot => rand >= loot.min && rand <= loot.max);

    if (loot) registerEvent('addItemToInventory', { itemId: loot.id });
   
    this.#returnToLevel(registerEvent, levelSystem);
  }

  #loseEncounter = (consoleSystem, player, registerEvent, levelSystem) => {
    const fightAnimationComponent = player.components.get('fightAnimationComponent');

    fightAnimationComponent.reset();

    player.isAlive = false;
   
    consoleSystem.addMessage('Staciłeś przytomność!');

    this.#returnToLevel(registerEvent, levelSystem);
  }

  #returnToLevel = (registerEvent, levelSystem) => {
    const levelName = levelSystem.currentLevel.name;

    registerEvent('requestedLevelChange', { name: levelName });
  }

  #processClick = (
    inputSystem, 
    consoleSystem, 
    registerEvent, 
    entities, 
    player, 
    floatingTextsSystem, 
    removeEntity,
    levelSystem
  ) => {
    if (!inputSystem.inputsToProcess.get('click')) return;
    const { x, y } = inputSystem.inputsToProcess.get('click');

    const escapeButtonSpriteComponent = entities.get('escapeButton').components.get('spriteComponent');

    if (pointInsideRectangle(x, y, escapeButtonSpriteComponent)) {
      consoleSystem.addMessage('Uciekłeś z pola bitwy.');
      
      this.#returnToLevel(registerEvent, levelSystem);
    }

    const playerFightStatisticsComponent = player.components.get('fightStatisticsComponent');

    const playerBattleSkillsComponent = player.components.get('battleSkillsComponent');

    const playerFightStatusesComponent = player.components.get('fightStatusesComponent');

    if (playerFightStatusesComponent.stun) return;

    playerBattleSkillsComponent.skills.forEach((skill, i) => {
      const buttonSpriteComponent = entities.get(`${skill.name}Button`).components.get('spriteComponent');

      if (!pointInsideRectangle(x, y, buttonSpriteComponent)) return;

      if (playerFightStatisticsComponent.currentPowerPoints < 100) return;

      if (playerFightStatisticsComponent.currentManaPoints < skill.manaCost) {
        consoleSystem.addMessage('Brak wystarczającej ilości punktów many!');
        
        return;
      }

      this.#useSkill(skill, player, entities, consoleSystem, floatingTextsSystem, removeEntity);
    });
  }

  #processMouseMovement = (inputSystem, renderSystem, entities, player) => {
    const playerBattleSkillsComponent = player.components.get('battleSkillsComponent');

    playerBattleSkillsComponent.skills.forEach((skill, i) => {
      const skillButton = entities.get(`${skill.name}Button`);

      const skillButtonSpriteComponent = skillButton.components.get('spriteComponent');

      const x = inputSystem.mouse.x;

      const y = inputSystem.mouse.y

      if (pointInsideRectangle(x, y, skillButtonSpriteComponent)) {
        const layerContext = renderSystem.layers.get('HUDLayer3').context;

        layerContext.globalAlpha = 0.7;

        layerContext.fillStyle = 'white';
       
        layerContext.drawImage(this.skillDescriptionBg, x - 10, y, 200, 80);

        layerContext.fillText('Nazwa: ' + skill.name, x - 5, y + 20);

        layerContext.fillText('Koszt many: ' + skill.manaCost, x - 5, y + 40);

        layerContext.fillText('Opis: ' + skill.description, x - 5, y + 60);

        layerContext.globalAlpha = 1;
      }
    });
  }

  #processKeyboardInput = (inputSystem, numberOfEnemies) => {
    if (!this.canChangeTarget) return;

    if (inputSystem.keyboard.arrowDown.isDown) {
      this.#currentPointerTargetIndex--;

      if (this.#currentPointerTargetIndex < 0) {
        this.#currentPointerTargetIndex = numberOfEnemies - 1;
      }

      throttleProperty(this, 'canChangeTarget', false, 300);
    }

    if (inputSystem.keyboard.arrowUp.isDown) {
      this.#currentPointerTargetIndex++;

      if (this.#currentPointerTargetIndex > numberOfEnemies - 1) {
        this.#currentPointerTargetIndex = 0;
      }

      throttleProperty(this, 'canChangeTarget', false, 300);
    }
  }

  #updatePlayerPowerPoints = (player) => {
    const playerFightStatusesComponent = player.components.get('fightStatusesComponent');

    const playerFightStatisticsComponent = player.components.get('fightStatisticsComponent');

    if (!playerFightStatusesComponent.stun) {
      playerFightStatisticsComponent.currentPowerPoints++;

      if (playerFightStatisticsComponent.currentPowerPoints > playerFightStatisticsComponent.maxPowerPoints) {
        playerFightStatisticsComponent.currentPowerPoints = playerFightStatisticsComponent.maxPowerPoints;
      }
    }
  }

  #updateEnemiesPowerPoints = (entities) => {
    const enemies = Array.from(entities.values()).filter(entity => entity.class === 'battleEnemy');

    enemies.forEach(enemy => {
      const enemyFightStatusesComponent = enemy.components.get('fightStatusesComponent');

      const enemyFightStatisticsComponent = enemy.components.get('fightStatisticsComponent');
  
      if (!enemyFightStatusesComponent.stun) {
        enemyFightStatisticsComponent.currentPowerPoints = (
          enemyFightStatisticsComponent.currentPowerPoints + randomNumber(10) / 10
        );
  
        if (enemyFightStatisticsComponent.currentPowerPoints > enemyFightStatisticsComponent.maxPowerPoints) {
          enemyFightStatisticsComponent.currentPowerPoints = enemyFightStatisticsComponent.maxPowerPoints;
        }
      }
    });
  }

  #drawPlayer = (player, entities, renderSystem, playerBattleSprite) => {
    const fightAnimationComponent = player.components.get('fightAnimationComponent');

    const spriteComponent = playerBattleSprite.components.get('spriteComponent');

    const playerFightStatisticsComponent = player.components.get('fightStatisticsComponent');

    const playerFightStatusesComponent = player.components.get('fightStatusesComponent');

    if (fightAnimationComponent.moveForward) {
      fightAnimationComponent.moveVariableInFight += 3;
      
      spriteComponent.x += 3;

      if (fightAnimationComponent.moveVariableInFight >= 80) {
        fightAnimationComponent.moveForward = false;

        fightAnimationComponent.moveBackward = true;
      }
    }

    if (fightAnimationComponent.moveBackward) {
      fightAnimationComponent.moveVariableInFight -= 3;

      spriteComponent.x -= 3;
      
      if (fightAnimationComponent.moveVariableInFight <= 0) {
        fightAnimationComponent.moveBackward = false;
      }
    }

    const playerHealthBar = entities.get('playerHealthBar');

    const healthBarBackgroundSpriteComponent = playerHealthBar.components.get('backgroundSpriteComponent');

    const healthBarSpriteComponent = entities.get('playerHealthBar').components.get('spriteComponent');

    healthBarSpriteComponent.width = (
      playerFightStatisticsComponent.currentHealthPoints / 
      playerFightStatisticsComponent.maxHealthPoints *
      (healthBarBackgroundSpriteComponent.width - (playerHealthBar.borderSize * 2))
    )

    const playerManaBar = entities.get('playerManaBar');
    
    const manaBarBackgroundSpriteComponent = playerManaBar.components.get('backgroundSpriteComponent');
    
    const manaBarSpriteComponent = entities.get('playerManaBar').components.get('spriteComponent');

    manaBarSpriteComponent.width = (
      playerFightStatisticsComponent.currentManaPoints / 
      playerFightStatisticsComponent.maxManaPoints *
      (manaBarBackgroundSpriteComponent.width - (playerManaBar.borderSize * 2))
    )

    const playerPowerBar = entities.get('playerPowerBar');

    const powerBarBackgroundSpriteComponent = playerPowerBar.components.get('backgroundSpriteComponent');

    const powerBarSpriteComponent = entities.get('playerPowerBar').components.get('spriteComponent');

    powerBarSpriteComponent.width = (
      playerFightStatisticsComponent.currentPowerPoints / 
      playerFightStatisticsComponent.maxPowerPoints *
      (powerBarBackgroundSpriteComponent.width - (playerPowerBar.borderSize * 2))
    )

    const healtBarTextLabelComponent = entities.get('playerHealthBar').components.get('textLabelComponent');

    const manaBarTextLabelComponent = entities.get('playerManaBar').components.get('textLabelComponent');

    const powerBarTextLabelComponent = entities.get('playerPowerBar').components.get('textLabelComponent');

    healtBarTextLabelComponent.text = `
      ${playerFightStatisticsComponent.currentHealthPoints} / ${playerFightStatisticsComponent.maxHealthPoints}
    `;

    manaBarTextLabelComponent.text = `
      ${playerFightStatisticsComponent.currentManaPoints} / ${playerFightStatisticsComponent.maxManaPoints}
    `;

    powerBarTextLabelComponent.text = `
      ${playerFightStatisticsComponent.currentPowerPoints} / ${playerFightStatisticsComponent.maxPowerPoints}
    `;
    
    const layerContext = renderSystem.layers.get('HUDLayer2');

    if (playerFightStatusesComponent.stun) {
      layerContext.save();

      layerContext.strokeStyle = 'black';

      layerContext.fillStyle = 'yellow';

      layerContext.font = '35px Georgia';

      layerContext.strokeText('Ogłuszony', 200, 250);

      layerContext.fillText('Ogłuszony', 200, 250);

      layerContext.restore();
    }   
  }

  #drawEnemies = (entities, renderSystem) => {
    const enemies = Array.from(entities.values()).filter(entity => entity.class === 'battleEnemy');

    const battlePointerSpriteComponent = entities.get('battlePointer').components.get('spriteComponent');

    enemies.forEach((enemy, i) => {
      const fightAnimationComponent = enemy.components.get('fightAnimationComponent');

      const spriteComponent = enemy.components.get('spriteComponent');

      const fightStatisticsComponent = enemy.components.get('fightStatisticsComponent');

      const fightStatusesComponent = enemy.components.get('fightStatusesComponent');

      if (fightAnimationComponent.moveForward) {
        fightAnimationComponent.moveVariableInFight -= 3;

        spriteComponent.x -= 3;

        if (fightAnimationComponent.moveVariableInFight <= -80) {
          fightAnimationComponent.moveForward = false;

          fightAnimationComponent.moveBackward = true;
        }
      }

      if (fightAnimationComponent.moveBackward) {
        fightAnimationComponent.moveVariableInFight += 3;

        spriteComponent.x += 3;
        
        if (fightAnimationComponent.moveVariableInFight >= 0) {
          fightAnimationComponent.moveBackward = false;
        }
      }

      const healthBarEntity = entities.get(`enemyHealthBar${enemy.name}`)

      const healthBarBackgroundSpriteComponent = healthBarEntity.components.get('backgroundSpriteComponent');

      const healthBarSpriteComponent = healthBarEntity.components.get('spriteComponent');

      healthBarSpriteComponent.width = (
        fightStatisticsComponent.currentHealthPoints / 
        fightStatisticsComponent.maxHealthPoints *
        (healthBarBackgroundSpriteComponent.width - (healthBarEntity.borderSize * 2))
      )

      const healtBarTextLabelComponent = healthBarEntity.components.get('textLabelComponent');

      healtBarTextLabelComponent.text = `
        ${fightStatisticsComponent.currentHealthPoints} / ${fightStatisticsComponent.maxHealthPoints}
      `;
      
      const layerContext = renderSystem.layers.get('HUDLayer');

      if (fightStatusesComponent.stun) {
        layerContext.save();

        layerContext.strokeStyle = 'black';

        layerContext.fillStyle = 'yellow';

        layerContext.font = '35px Georgia';

        layerContext.strokeText('Ogłuszony', 200, 250);

        layerContext.fillText('Ogłuszony', 200, 250);
        
        layerContext.restore();
      } 

      if (this.#currentPointerTargetIndex === i) {
        battlePointerSpriteComponent.x = spriteComponent.x + 25;

        battlePointerSpriteComponent.y = spriteComponent.y - 50;
      }
    });
  }

  #useSkill = (skill, player, entities, consoleSystem, floatingTextsSystem, removeEntity) => {
    const enemies = Array.from(entities.values()).filter(entity => entity.class === 'battleEnemy');

    const playerFightStatisticsComponent = player.components.get('fightStatisticsComponent');

    const fightAnimationComponent = player.components.get('fightAnimationComponent');

    if (playerFightStatisticsComponent.currentPowerPoints < 200) return;

    fightAnimationComponent.moveForward = true;
    
    playerFightStatisticsComponent.currentManaPoints -= skill.manaCost;

    playerFightStatisticsComponent.currentPowerPoints -= 200;

    consoleSystem.addMessage(`Użyto umiejętności ${skill.name}`);

    const damage = 105;

    const enemy = enemies[this.#currentPointerTargetIndex];

    const enemyFightStatisticsComponent = enemy.components.get('fightStatisticsComponent');

    const enemySpriteComponent = enemy.components.get('spriteComponent');

    enemyFightStatisticsComponent.currentHealthPoints -= damage;
   
    consoleSystem.addMessage('Zadałeś ' + enemy.name + ' ' + damage + ' punktów obrażeń!');

    floatingTextsSystem.addFloatingText(damage, enemySpriteComponent.x, enemySpriteComponent.y, 'red', 4500);

    if (enemyFightStatisticsComponent.currentHealthPoints < 1) {
      consoleSystem.addMessage('Przeciwnik ' + enemy.name + ' zginął!');

      this.#currentPointerTargetIndex--;

      if (this.#currentPointerTargetIndex < 0) {
        this.#currentPointerTargetIndex = 0;
      }

      removeEntity(enemy.name);
      //this.game.notifyAction({action: 'kill' , target: this.type});
    }

 // switch (skill.number) {
    //   case 0:
    //     break;
    //   case 1:
    //     break;
    //   default:
    //     break;
    // }

   
      //     let dmg;
      //     /*if (this.equippedItems[3]) {
      //       dmg = this.strenght + randomNumber(this.equippedItems[3].bonus - 1) + 1;
      //     }
      //     else {
      //       dmg = this.strenght;
      //     }*/
      //     dmg = 10;
      //     target.getDamage(dmg);
     
        //     let dmg;
        //     switch (skillIndex) {
        //       case 0:
        //         /*if (this.equippedItems[3]) {
        //           dmg = this.strenght * 2 + randomNumber(this.equippedItems[3].bonus - 1) + 1;
        //         }
        //         else {
        //           dmg = this.strenght * 2;
        //         }
        //         */
        //         //dmg = Math.floor(dmg);
        //         dmg = 20;
        //         this.fightScene.encounter.actualTarget.getDamage(dmg)
        //         break;
        //       case 1:
        //         /*
        //         if (this.equippedItems[3]) {
        //           dmg = this.strenght / 2 + randomNumber(this.equippedItems[3].bonus -1) + 1;
        //         }
        //         else {
        //           dmg = this.strenght / 2;
        //         }
        //         dmg = Math.floor(dmg);
        //         */
        //         dmg = 10;
        //         for (let i = 0; i < this.fightScene.encounter.encounterEnemies.length; i++) {
        //           this.fightScene.encounter.encounterEnemies[i].getDamage(dmg);
        //         }
  }

  #enemiesAttacks = (consoleSystem, player, floatingTextsSystem, entities) => {
    const enemies = Array.from(entities.values()).filter(entity => entity.class === 'battleEnemy');

    enemies.forEach(enemy => {
      const enemyFightStatisticsComponent = enemy.components.get('fightStatisticsComponent');

      const enemyFightAnimationComponent = enemy.components.get('fightAnimationComponent');

      if (enemyFightStatisticsComponent.currentPowerPoints < 200) return;

      enemyFightAnimationComponent.moveForward = true;

      enemyFightStatisticsComponent.currentPowerPoints -= 200;

      const damage = 1;

      //let reducedDmg = dmg - Math.floor(this.fightStatistics.armorPoints / 3);
        //     if (reducedDmg <= 0) reducedDmg = 1;

      consoleSystem.addMessage('Otrzymałeś ' + damage + ' punktów obrażeń od ' + enemy.name + '!');

      const playerFightStatisticsComponent = player.components.get('fightStatisticsComponent');

      const playerSpriteComponent = entities.get('playerBattleSprite').components.get('spriteComponent');

      playerFightStatisticsComponent.currentHealthPoints -= damage;

      floatingTextsSystem.addFloatingText(damage, playerSpriteComponent.x, playerSpriteComponent.y, 'red', 4500);
    });
  }
}
