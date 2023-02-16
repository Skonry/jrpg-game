export default {
  name: 'startLevel',
  displayName: 'Droga do wioski',
  startPositionX: 600,
  startPositionY: 3500,
  mapWidth: 1200,
  mapHeight: 4000,
  widthWithBackground: 1200 + 1500,
  heightWithBackground: 4000 + 1500,
  xWithBacground: -500,
  yWithBackground: -400,
  npcsOnMap: [],
  shrine: false,
  randomEncounterRate: 5,
  teleports: [
    {
      x: 550,
      y: 50,
      destinationLevelName: 'secondLevel',
      destinationLevelX: 750,
      destinationLevelY: 1850,
    }
  ],
  chests: [
    {
      x: 200,
      y: 2500,
      spriteSrc: 'img/skrzynia.png',
      openingCodeLength: 4
    }
  ],
  battleBackgrounds: ['img/battlegrounds/bg01.png'],
  monsters: ['spider'],
  
  init({ systems, addEntity }) {
    const renderSystem = systems.get('renderSystem');

    renderSystem.addCanvasLayer('Layer', 5);

    renderSystem.addCanvasLayer('EntitiesLayer', 10);

    renderSystem.addCanvasLayer('EntitiesLayer2', 15);

    renderSystem.addCanvasLayer('HUDLayer', 20);

    renderSystem.addCanvasLayer('HUDLayer2', 25);

    this.map = new Image();
    this.map.src = 'img/levels/level01.png';

    const chestSystem = systems.get('chestSystem');

    this.chests.forEach((chest, index) => {
      const chestName = `chest${index}`;

      addEntity(
        chestName,
        chestSystem.createChest(chestName, chest.x, chest.y, chest.openingCodeLength, 'Layer')
      );
    });

    const teleportSystem = systems.get('teleportSystem');

    this.teleports.forEach((teleport, index) => {
      const teleportName = `teleport${index}`;

      addEntity(
        teleportName,
        teleportSystem.createTeleport(
          teleportName, 
          teleport.x, 
          teleport.y, 
          teleport.destinationLevelName,
          teleport.destinationLevelX,
          teleport.destinationLevelY,
          'Layer'
        )
      )
    });
  },

  dispose({ systems, removeEntity, entities }) {
    const chests = Array.from(entities.values()).filter(entity => entity.class === 'chest');

    const teleports = Array.from(entities.values()).filter(entity => entity.class === 'teleport');

    chests.forEach(chest => removeEntity(chest.name));

    teleports.forEach(teleport => removeEntity(teleport.name));

    const renderSystem = systems.get('renderSystem');

    renderSystem.removeCanvasLayer('Layer');
    renderSystem.removeCanvasLayer('EntitiesLayer');
    renderSystem.removeCanvasLayer('EntitiesLayer2');
    renderSystem.removeCanvasLayer('HUDLayer');
  },

  update({ systems }) {
    const currentScene = systems.get('sceneSystem').currentScene;

    if (currentScene) return;

    const levelLayer = systems.get('renderSystem').layers.get('Layer');

    levelLayer.context.fillStyle = 'rgb(60, 127, 234)';

    levelLayer.context.fillRect(
      this.xWithBacground, 
      this.yWithBackground, 
      this.widthWithBackground,
      this.heightWithBackground
    );

    levelLayer.context.drawImage(this.map, 0, 0, this.map.width, this.map.height);
  }
};
