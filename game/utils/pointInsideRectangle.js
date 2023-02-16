export default function pointInsideRectangle(xCord, yCord, rect) {
  return (xCord > rect.x && xCord < rect.x + rect.width && yCord > rect.y && yCord < rect.y + rect.height);
}
