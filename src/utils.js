import dayjs from 'dayjs';

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

export const getRandomDate = (startYear, endYear) => {
  const randomYear = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
  const randomMonth = Math.floor(Math.random() * 12);
  const randomDay = Math.floor(Math.random() * 28) + 1;
  const randomDate = new Date(Date.UTC(randomYear, randomMonth, randomDay, 0, 0, 0, 0));
  return randomDate.toISOString();
};

export const getCurrentTime = () => {
  const currentDate = new Date();
  return currentDate.toISOString();
};

export const dateToMDY = (date) => dayjs(date).format('MMMM D YYYY');
export const dateToY = (date) => dayjs(date).format('YYYY');

// вернет случайный массив из элементов массива длдинной в 4
export const getRandomSubset = (set, length)  => {
  const subsetLength = Math.floor(Math.random() * length) + 1;
  const subset = [];
  const copyArr = [...set];
  for (let i = 0; i < subsetLength; i++) {

    const randomIndex = Math.floor(Math.random() * copyArr.length);
    subset.push(copyArr[randomIndex]);
    copyArr.splice(randomIndex, 1);
  }
  return subset;
};

export const getRandomBoolean = () => Math.random() >= 0.5;

export const isEscapeKey = (evt) => evt.key === 'Escape';
