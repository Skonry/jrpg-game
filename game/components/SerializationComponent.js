export default class SerializationComponent {
  constructor(saveCallback, loadCallback) {
    this.saveCallback = saveCallback;
    this.loadCallback = loadCallback;
  }
}
