export default class GameTimeSystem {
  #tickCounter = 0;

  update = ({ systems }) => {
    const inputSystem = systems.get('inputSystem');

    const consoleSystem = systems.get('consoleSystem');

    const currentScene = systems.get('sceneSystem').currentScene;

    if (inputSystem.keyboard.t.isDown && !currentScene) {
      consoleSystem.addMessage(this.#printCurrentTime());
    }

    this.#tickCounter++;
  }

  #skipHours = hours => this.#tickCounter += hours * 1980;

  #printCurrentTime = () => {
    let days = Math.floor(this.#tickCounter / 47520) + 1;

    let hours = Math.floor(this.#tickCounter / 1980) - 24 * days;

    let minutes = Math.floor(this.#tickCounter / 33) - 60 * (hours + 24 * days);

    if (hours <= 9) hours = '0' + hours;

    if (minutes <=9) minutes = '0' + minutes;
    
    const text = 'Dzień: ' + days + ' | Godzina: ' + hours + ':' + minutes;

    return text;
  }
}
