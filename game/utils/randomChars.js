import randomNumber from './randomNumber.js';

export default function randomChars(quantity){
  const chars = [];
  for (let i = 0; i < quantity; i++) {
    const char = String.fromCharCode(randomNumber(24) + 65);
    chars.push(char);
  }
  return chars;
}
