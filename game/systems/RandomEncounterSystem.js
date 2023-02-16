import randomNumber from '../utils/randomNumber';

export default class RandomEncounterSystem {
  generatedEncounter = null;

  update = ({ systems, entities, registerEvent }) => {
    const currentScene = systems.get('sceneSystem').currentScene;

    if (currentScene) return;

    const currentLevel = systems.get('levelSystem').currentLevel;

    const dataSystem = systems.get('dataSystem');

    const playerEntity = entities.get('player');
    
    if (this.#canStartEncounter(playerEntity, currentLevel)) {
      const rand = randomNumber(1000) + 1;

      if (rand < currentLevel.randomEncounterRate) {
        this.#generateEncounter(currentLevel, dataSystem, registerEvent);
      }
    }
  }

  #canStartEncounter = (playerEntity, currentLevel) => {
    const movementComponent = playerEntity.components.get('movementComponent');

    return (
      currentLevel.randomEncounterRate &&
      playerEntity.isAlive &&
      movementComponent.isMoving
    )
  }

  #generateEncounter = (currentLevel, dataSystem, registerEvent) => {
    const rand = randomNumber(currentLevel.monsters.length);

    const monsterData = dataSystem.getMonsterData(currentLevel.monsters[rand]);

    this.generatedEncounter = {
      monsterData,
      numberOfEnemies: 2,
      battleBackground: currentLevel.battleBackgrounds[randomNumber(1)],
      experiencePoints: 100
    };

    registerEvent('requestedSceneChange', { name: 'fightIntroScene' })
  }
}
