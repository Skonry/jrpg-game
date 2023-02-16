export default class MovementComponent {
  isMoving = false;
  canMove = true;
  canMoveUp = true;
  canMoveDown = true;
  canMoveLeft = true;
  canMoveRight = true;
  movementDirection = 'down';
  lastMovementDirection = 'down';
  lastMoveX = 0;
  lastMoveY = 0;
  movementSpeed;

  constructor(movementSpeed = 5) {
    this.movementSpeed = movementSpeed;
  }
}
