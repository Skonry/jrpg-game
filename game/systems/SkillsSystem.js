import randomNumber from '../utils/randomNumber.js';

export default class SkillsSystem {
  #sprite = new Image();
  #isOpen = false;
  #skills = new Map();

  constructor() {
    this.#sprite.src = 'img/umyjkibg.png';
  }

  init = ({ systems }) => {
    const inputSystem = systems.get('inputSytem');

    inputSystem.subscribeSignal('sDown', this.#toggle);

    this.#skill.set('openLocks', 35);
    this.#skill.set('persuasion', 35);
    this.#skill.set('intimidation', 35);
  }

  update = ({ systems }) => {
    if (!this.#isOpen) return;

    const HUDLayer = systems.get('rendererSystem').getLayers().get('HUDLayer');
   
    HUDLayer.font = '35px Georgia';

    HUDLayer.drawImage(this.#sprite, 50, 120);

    HUDLayer.fillStyle = 'rgb(255,255,255)';

    HUDLayer.fillText('Otwieranie zamków:  ' + this.#skills.get('openLocks'), 70, 240);
    
    HUDLayer.fillText('Perswazja:  ' + this.#skills.get('persuasion'), 70, 280);

    HUDLayer.fillText('Zastraszanie:  ' + this.#skills.get('intimidation'), 70, 320);
  }

  skillCheck = skill => {
    const rand = randomNumber(100) + 1;

    console.log('Skill test result: ' + rand);
    
    return rand <= this.#skills.get(skill);
  }

  #setSkillValue = (skill, value) => this.#skills.set(skill, value);

  #modifySkillValue = (skill, value) => this.#skills.set(skill, this.#skills.get(skill) + value);

  #toggle = () => {
    this.#isOpen = !this.#isOpen;

    const movementComponent = playerEntity.components.get('movementComponent')

    movementComponent.canMove = !this.#isOpen;
  }
}
