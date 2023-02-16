export default class QuestSystem {
  quests = [];

  init = ({ systems }) => {
    const dataSystem = systems.get('dataSystem');

    const localStorageSystem = systems.get('localStorageSystem');

    // this.quests.push({
    //   id:
    //   name:
    //   reward:
    //   objectives:
    //   requirements:
    //   ownerName:
    //   dialogToTakeQuest:
    //   dialogsDependentOnQuestState:
    //   status:
    //   currentObjectiveIndex:
    //   aimCounter:
    // });
  }

  update = ({ systems, events }) => {
    this.quests.forEach(quest => {
      if (quest.status === 'finished') return;

      if (!events.has(quest[quest.currentObjectiveIndex].action)) return;

      const event = events.get(quest[quest.currentObjectiveIndex].action);

      if (event.target !== quest.objectives[quest.currentObjectiveIndex].target) return;

      quest.aimCounter++;

      if (quest.aimCounter >= quest.objectives[quest.currentObjectiveIndex].number) {
        quest.currentObjectiveIndex++;

        if (!quest.objectives[quest.currentObjectiveIndex]) {
          this.#completeQuest();
        }
        else {
          quest.aimCounter = 0;
        }
      }
    });
  }

  #completeQuest = () => {
    this.currentObjectiveIndex++;
    this.game.player.exp += this.reward.exp;
    this.game.player.gold += this.reward.gold;
    this.active = false;
    this.finished = true;
    this.status = 2;
    this.game.console.addMessage(
      "Wykonano zadanie " + this.name + ". Otrzymano " +
      this.reward.gold + " sztuk złota i " +
      this.reward.exp + " punktów doświadczenia."
    );
  }
}
