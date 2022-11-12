export function getRandomNumber(max = 100, min = 0, step = 1) {
  return Math.floor(Math.random() * (max - min) / step) * step + min;
}