export default class Game {
  systems = new Map();
  entities = new Map();
  events = new Map();

  addSystem = (name, system) => this.systems.set(name, system);

  addEntity = (name, entity) => this.entities.set(name, entity);

  removeEntity = name => {
    if (!this.entities.has(name)) return;

    const children = this.entities.get(name).childRelations;

    children.forEach(child => this.entities.delete(child));

    this.entities.delete(name);
  }

  start = () => {
    this.systems.forEach(system => {
      if (!(typeof system?.init === 'function')) return;

      system.init({
        entities: this.entities, 
        systems: this.systems,
        addEntity: this.addEntity,
        registerEvent: this.registerEvent,
        removeEntity: this.removeEntity,
        game: this
      });
    });

    requestAnimationFrame(this.#tick);
  }

  #tick = () => {
    const lastTickEvents = new Map(this.events);

    this.events.clear();

    this.systems.forEach(system => {
      if (!(typeof system?.update === 'function')) return;

      system.update({
        entities: this.entities, 
        systems: this.systems,
        events: lastTickEvents,
        registerEvent: this.registerEvent,
        addEntity: this.addEntity,
        removeEntity: this.removeEntity,
        addSystem: this.addSystem
      });
    });

    requestAnimationFrame(this.#tick);
  }

  registerEvent = (name, data) => this.events.set(name, data)
}
