export default class JournalSystem {
  #isOpen = false;

  init = ({ systems, entites }) => {
    const inputSystem = systems.get('inputSystem');

    const playerEntity = entites.get('player');

    inputSystem.subscribeSignal('qDown', () => this.#toggle(playerEntity));
  }

  update = ({ systems }) => {
    if (!this.#isOpen) return;

    const questSystem = systems.get('questSystem');

    const HUDLayer = systems.get('rendererSystem').getLayers().get('HUDLayer');

    HUDLayer.fillText('Aktywne zadania:', 50, 170);

    questSystem.quests.forEach((quest, i) => {
      if (!quest.status === 'active') return;

      const text = 
        `* ${quest.name} - ${quest.objectives[quest.currentObjectiveIndex].desciption}` +
        `- (${quest.aimCounter}/${quest.objectives[quest.currentObjectiveIndex].number})`; 

      HUDLayer.fillText(text, 50, 220 + i * 40);
    });
  }

  #toggle = playerEntity => {
    this.#isOpen = !this.#isOpen;

    const movementComponent = playerEntity.components.get('movementComponent')

    movementComponent.canMove = !this.#isOpen;
  }
}
