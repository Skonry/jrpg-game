export default class NpcQuestComponent {
  questExclamationMarkImage = new Image();
  questIds;

  constructor(questIds) {
    this.questIds = questIds;
    this.questExclamationMarkImage.src = 'img/wykrzyknik.png';
  }
}
