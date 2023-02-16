export default function displayStyledText(text, context, x, y) {
  const fragmentsToStyle = [];

  for (let i = 0; i < text.length; i++) {
    if (text[i] === '$') {
      const endIndex = text.indexOf('#', i + 1);
      const colorNumbers = {
        '1': 'red',
        '2': 'green',
        '3': 'blue'
      }
      const color = colorNumbers[text[i + 1]];
      fragmentsToStyle.push({startIndex: i, endIndex, color});
    }
  }
  if (fragmentsToStyle.length > 0) {
    let stringIndex = 0;
    for (const fragment of fragmentsToStyle) {
      context.save();

      context.fillText(text.substring(stringIndex, fragment.startIndex), x, y);

      x += context.measureText(text.substring(stringIndex, fragment.startIndex)).width;

      context.fillStyle = fragment.color;

      context.fillText(text.substring(fragment.startIndex + 2, fragment.endIndex), x, y);

      x += context.measureText(text.substring(fragment.startIndex + 2, fragment.endIndex)).width;

      context.restore();

      stringIndex = fragment.endIndex + 1;
    }

    x = context.measureText(text.substring(0, stringIndex)).width + 250;

    context.fillText(text.substring(stringIndex), x, y);

  }

  else {
    context.fillText(text, x, y);
  }
}
