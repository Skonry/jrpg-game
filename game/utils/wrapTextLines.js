export default function wrapTextLines(text, lineLengthLimit) {
  const rowsNumber = Math.ceil(text.length / lineLengthLimit);
  const rowsArray = [];
  if (rowsNumber === 1) {
    rowsArray.push(text);
  }
  else {
    let indexStart = 0;
    let indexEnd = lineLengthLimit;
    while (indexEnd < text.length) {
      indexEnd = text.lastIndexOf(" ", indexEnd);
      const row = text.substring(indexStart, indexEnd);
      rowsArray.push(row);
      indexStart = indexEnd + 1;
      indexEnd += lineLengthLimit;
    }
    const lastRow = text.substring(indexStart);
    rowsArray.push(lastRow);
  }
  return rowsArray;
}
