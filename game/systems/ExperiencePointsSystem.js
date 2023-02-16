export default class ExperiencePointsSystem {
  update = ({ entities, events, systems }) => {
    if (events.has('wonEncounter')) {
      const player = entities.get('player');

      const consoleSystem = systems.get('consoleSystem');

      addExperiencePoints(events.get('wonEncounter'), player, consoleSystem);
    }
  }

  addExperiencePoints = ({ experiencePoints }, player, consoleSystem) => {
    const expComponent = player.components.get('experiencePointsComponent')

    const fightStatisticsComponent = player.components.get('fightStatisticsComponent');

    expComponent.exp += experiencePoints;

    consoleSystem.addMessage(`Dostałeś ${experiencePoints} punktów doświadczenia`)

    if (expComponent.exp >= expComponent.levelUpExpRequirements[expComponent.level]) {
      expComponent.level++;

      consoleSystem.addMessage(`Awansowałeś na ${expComponent.level} poziom doświadczenia!`)

      fightStatisticsComponent.maxHealthPoints += 50;
      fightStatisticsComponent.healthPoints = fightStatisticsComponent.maxHealthPoints;
      fightStatisticsComponent.maxManaPoints += 10;
      fightStatisticsComponent.manaPoints = fightStatisticsComponent.maxManaPoints;
      fightStatisticsComponent.strenght += 5;
    }
  }
}
