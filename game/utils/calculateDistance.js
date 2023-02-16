export default function calculateDistance(objA, objB) {
  return Math.sqrt(Math.pow(objA.x - objB.x, 2) + Math.pow(objA.y - objB.y, 2));
}
