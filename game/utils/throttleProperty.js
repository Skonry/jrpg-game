export default function throttleProperty(target, property, temporaryBoolean = false, delay = 100) {
  target[property] = temporaryBoolean;
  setTimeout(() => target[property] = !temporaryBoolean, delay);
}
