export default class CollisionSystem {
  someCollide = (entity, entities) => (
    Array.from(entities.values()).find(currentEntity => (
      this.#detectCollision(
        entity.components.get('positionComponent'), 
        currentEntity.components.get('positionComponent')
      )
    ))
  );

  #detectCollision = (a, b) => (
    a.x + a.width >= b.x && 
    a.x <= b.x + b.width && 
    a.y + a.height >= b.y && 
    a.y <= b.y + b.height
  );
}
