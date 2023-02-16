export default class ResurrectionSystem {
  #deathFogImage = new Image();

  constructor() {
    this.#deathFogImage.src = 'img/gray_bg.png';
  }

  update = ({ systems, entities }) => {
    const inputSystem = systems.get('inputSystem');

    const collisionSystem = systems.get('collisionSystem');

    const playerEnity = entities.get('player');

    if (
      inputSystem.keyboard.space.isDown &&
      playerEnity.isAlive &&
      collisionSystem.someCollide(playerEnity, Array.from(entities.values()).filter(v => v.class === 'shrine'))
    ) {
      resurrectPlayer(playerEnity);
    }
  }

  

  #resurrectPlayer = playerEnity => {
  /*this.game.player.isAlive = true;
    this.game.player.healthPoints = this.game.player.maxHealthPoints / 2;
    const expPenalty = 500;
    this.game.player.exp -= expPenalty;
    if (this.game.player.exp < 0) {
      this.game.player.exp = 0;
    }
    this.game.console.addMessage("Wskrzeszono bohatera. Odjęto " + expPenalty +" punktów doświadczenia.");
    */
  }
}
