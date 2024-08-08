import { getRandomInteger, getRandomNumber, getRandomElement } from '../utils.js';

const getMovieName = () => {
  const movieNames = [
    'Made for each other',
    'Popeye meets Sinbad',
    'Sagebrush trail',
    'Santa Claus conquers the martians',
    'The dance of life',
    'The great flamarion',
    'The man with the golden arm',
  ];

  return getRandomElement(movieNames);
};

const getMovieGenre = () => {
  const movieGenres = [
    'Action',
    'Adventure',
    'Animation',
    'Biography',
    'Comedy',
    'Crime',
    'Documentary',
    'Drama',
    'Family',
    'Fantasy',
    'History',
    'Horror',
    'Musical',
    'Mystery',
    'Romance',
    'Science Fiction',
    'Sport',
    'Thriller',
    'War',
    'Western'
  ];
  return getRandomElement(movieGenres);
};

const getMovieDescription = () => {
  const movieDescriptions = [
    'In a dystopian future, a lone hero must navigate a treacherous wasteland to save humanity from an evil empire.',
    'A quirky romance blossoms between two unlikely individuals who discover they have more in common than they ever imagined.',
    'When a small town is invaded by mysterious creatures, a group of friends bands together to uncover the truth and save their community.',
    'An elite spy is forced to go rogue after being framed by a powerful enemy. With time running out, they must clear their name and stop a global catastrophe.',
    'A talented musician struggles with fame, addiction, and personal demons while trying to create a masterpiece that will change the world.'
  ];
  return getRandomElement(movieDescriptions);
};

const getMoviePoster = () => {
  const path = `../../public/images/posters/${getRandomInteger(1,7)}.jpg`;
  return path;
};

const getMovieRating = () => getRandomNumber(4);

const getMovieYear = () => getRandomInteger(1929, 1990);

const getMovieLength = () => {
  const movieTime = `${getRandomInteger(1, 3)}h ${getRandomInteger(0, 59)}m`;
  return movieTime;
};

export const generateMovie = () => ({
  title: getMovieName(),
  rating: getMovieRating(),
  year: getMovieYear(),
  duration: getMovieLength(),
  genre: getMovieGenre(),
  poster: getMoviePoster(),
  description: getMovieDescription()
});
