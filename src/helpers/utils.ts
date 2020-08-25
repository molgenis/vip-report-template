export const max = (arrayOfNumbers: Array<number>) => {
  return arrayOfNumbers.reduce((numberA, numberB) => {
    return Math.max(numberA, numberB);
  });
};
