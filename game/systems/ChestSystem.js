import ChestEntity from "../entities/ChestEntity";

export default class ChestSystem {
  chest = null;

  update = ({ systems, entities, registerEvent }) => {
    const inputSystem = systems.get('inputSystem');

    const collisionSystem = systems.get('collisionSystem');

    const renderSystem = systems.get('renderSystem');

    const player = entities.get('player');

    const chests = Array.from(entities.values()).filter(entity => entity.class === 'chest');

    const collidedChest = collisionSystem.someCollide(player, chests);

    if (collidedChest && inputSystem.keyboard.space.isDown) {
      this.chest = collidedChest;
      
      registerEvent('requestedSceneChange', { name: 'openingChestScene' });
    }
    else {
      chests.forEach(chest => {
        const component = chest.components.get('spriteComponent');

        const layerContext = renderSystem.layers.get(component.layerName).context;

        layerContext.drawImage(component.sprite, component.x, component.y, component.width, component.height);
      });
    }
    
  }

  createChest = (name, x, y, codeLength, layerName) => {
    return new ChestEntity(name, x, y, this.#generateOpeningCode(codeLength), layerName);
  }

  #generateOpeningCode = codeLength => Array(codeLength).map(_ => randomNumber(2) === 0 ? 'left' : 'right');   
}


