import Button from '../guiElements/Button.js';
import pointInsideRectangle from '../utils/pointInsideRectangle.js';

export default class NoteSystem {
  #isOpen = false;
  #sprite = new Image();
  #returnButton = new Button(40, 610, 160, 80, 'img/btn_back.png');
  #x = 250;
  #y = 10;
  #width = 600;
  #height = 700;

  update = ({ systems, entities, events }) => {
    if (events.has('openedNote')) {
      const event = events.get('openedNote');

      text
      spriteSrc
      this.#openNote();
    }

    if (!this.#isOpen) return;

    const renderSystem = systems.get('renderSystem');

    const HUDLayer = renderSystem.getLayers().get('HUDLayer');

    HUDLayer.save();
    HUDLayer.fillStyle = 'black';
    HUDLayer.drawImage(this.#sprite, this.#x, this.#y, this.#width, this.#height);
    HUDLayer.fillText(this.text, this.x + 60, this.y + 90);
    HUDLayer.drawImage(this.#returnButton.sprite, this.#returnButton.x, this.returnButton.y);
    HUDLayer.restore();
  }

  #openNote = () => {
    if (this.game.player.canToggleWindow) {
      this.isOpen = true;
      this.game.player.canMove = false;
      this.game.input.subscribeSignal('click', this.onClick, this, 'closeNote')
    }
  }

  #onCLick({x, y}) {
    if (pointInsideRectangle(x, y, this.returnButton)) {
      this.isOpen = false;
      this.game.player.canMove = true;
      this.game.input.removeCallback('closeNote', 'click');
    }
  }

}
