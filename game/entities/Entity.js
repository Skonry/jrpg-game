export default class Entity {
  constructor(name, entityClass, components, childRelations) {
    this.name = name;
    this.class = entityClass;
    this.components = new Map(components);
    this.childRelations = new Map(childRelations);
  }

  addChild = (key, value) => this.childRelations.add(key, value);
}
