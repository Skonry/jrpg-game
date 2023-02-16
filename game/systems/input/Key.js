export default class Key {
  constructor(repeatable = false) {
    this.repeatable = repeatable;
    this.isDown = false;
  }
}
