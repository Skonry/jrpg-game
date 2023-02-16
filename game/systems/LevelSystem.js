export default class LevelSystem {
  #levels = new Map();
  currentLevel = null;

  update = ({ entities, systems, events, addEntity, registerEvent, removeEntity }) => {
    if (events.has('requestedLevelChange')) {
      const event = events.get('requestedLevelChange');

      const consoleSystem = systems.get('consoleSystem');

      consoleSystem.addMessage(`Aktualny poziom: ${event.name}`);

      const playerPositionComponent = entities.get('player').components.get('positionComponent');

      const sceneSystem = systems.get('sceneSystem');

      if (typeof sceneSystem.currentScene?.dispose === 'function') {
        sceneSystem.currentScene.dispose({ systems, removeEntity, entities });
      }

      if (typeof this.currentLevel?.dispose === 'function') {
        this.currentLevel.dispose({ systems, removeEntity, entities });
      }

      sceneSystem.currentScene = null;

      this.currentLevel = this.#levels.get(event.name);

      playerPositionComponent.x = this.currentLevel.startPositionX;

      playerPositionComponent.y = this.currentLevel.startPositionY;

      registerEvent(
        'setPlayerPositionOnLevel', 
        { x: this.currentLevel.startPositionX, y: this.currentLevel.startPositionY }
      );
  
      if (typeof this.currentLevel?.init === 'function') this.currentLevel.init({ systems, addEntity });
    }

    if (this.currentLevel) this.currentLevel.update({ systems, registerEvent, entities, addEntity });
  }

  addLevel = (name, object) => {
    this.#levels.set(name, object);
  }
}
