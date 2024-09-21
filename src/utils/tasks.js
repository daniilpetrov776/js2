import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);
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

export const minutesToTime = (runtime) => dayjs.duration(runtime, 'minutes').format('H[h] mm[m]');

export const dateToMDY = (date) => dayjs(date).format('DD MMMM YYYY');

export const dateToY = (date) => dayjs(date).format('YYYY');

export const dateToRelativeTime = (date) => {
  const dateFromData = dayjs(date);
  return dayjs().to(dateFromData);
};

const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

export const sortByNewest = (movieA, movieB) => {
  const weight = getWeightForNullDate(movieA.filmInfo.year, movieB.filmInfo.year);

  return weight ?? dayjs(movieB.filmInfo.year).diff(dayjs(movieA.filmInfo.year));
};

export const compareMoviesRating = (movieA, movieB) => movieB.filmInfo.rating - movieA.filmInfo.rating;

export const isEveryRatingSame = (movies) => {
  const firstRating = movies[0].filmInfo.rating;
  console.log(firstRating);
  const isRatingSame = movies.every((movie) => movie.filmInfo.rating === firstRating);
  console.log(isRatingSame);
  return isRatingSame;
};

export const getTwoRandomMovies = (movies) => {
  if (movies.length === 1) {
    return movies;
  }
  const firstRandomIndex = Math.floor(Math.random() * movies.length);
  let secondRandomIndex;
  do {
    secondRandomIndex =  Math.floor(Math.random() * movies.length);
  } while (secondRandomIndex === firstRandomIndex);
  return [movies[firstRandomIndex], movies[secondRandomIndex]];
};
