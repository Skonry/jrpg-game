export default class FightAnimationComponent {
  constructor() {
    this.moveForward = false;
    this.moveBackward = false;
    this.moveVariableInFight = 0;
  }

  reset = () => {
    this.moveForward = false;
    this.moveBackward = false;
    this.moveVariableInFight = 0;
  }
}
