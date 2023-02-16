export default class SceneSystem {
  #scenes = new Map();
  #initialSceneName = null;
  currentScene = null;

  init = ({ systems, addEntity, registerEvent }) => {
    const scene = this.#scenes.get(this.#initialSceneName);

    this.currentScene = scene;

    if (typeof scene?.init === 'function') scene.init({ systems, addEntity, registerEvent });
  }

  update = ({ entities, events, systems, addEntity, registerEvent, removeEntity, addSystem }) => {
    const event = events.get('requestedSceneChange')
   
    if (event) this.#changeCurrentScene(event, systems, addEntity, removeEntity, addSystem, entities);

    if (this.currentScene) this.currentScene.update({ systems, registerEvent, entities, addEntity });
  }

  addScene = (name, object) => {
    this.#scenes.set(name, object);
  }

  setInitialScene = (name) => this.#initialSceneName = name;

  currentSceneName = () => this.currentScene?.name;

  #changeCurrentScene = ({ name }, systems, addEntity, removeEntity, addSystem, entities) => {
    const levelSystem = systems.get('levelSystem');

    if (typeof this.currentScene?.dispose === 'function') {
      this.currentScene.dispose({ systems, removeEntity, entities });
    }

    if (typeof levelSystem.currentLevel?.dispose === 'function') {
      levelSystem.currentLevel.dispose({ systems, removeEntity, entities });
    }

    this.currentScene = this.#scenes.get(name);
    
    if (typeof this.currentScene?.init === 'function') {
      this.currentScene.init({ systems, addEntity, addSystem, entities });
    }
  }
}
