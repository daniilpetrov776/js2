export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomNumber = (min = 0, max = 10, decimals = 1) => (Math.random() * (max - min) + min).toFixed(decimals);

export const getRandomElement = (elements) => {
  const randomElement = elements[getRandomInteger(0, elements.length - 1)];
  return randomElement;
};

// export const getRandomNumber = () => {
//   const randomNumber = Math.random() * 10;
//   const formattedNumber = randomNumber.toFixed(1);
//   return formattedNumber;
// };
