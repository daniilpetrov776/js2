import { getRandomInteger, getRandomNumber, getRandomElement, getRandomSubset, getRandomBoolean } from '../utils/utils.js';
import { getRandomDate, getCurrentTime } from '../utils/tasks.js';
import { nanoid } from 'nanoid';
import { getMovieComments } from './comments.js';
const MAX_AMOUNT_OF_ACTORS = 5;
const MAX_AMOUNT_OF_WRITERS = 3;
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

const getAlternativeMovieName = () => {
  const alternativeMovieNames = [
    'Journey to the Moon',
    'The Phantom Carriage',
    'The General',
    'Metropolis',
    'Sunrise: A Song of Two Humans',
    'The Last Laugh',
    'Nosferatu',
  ];

  return getRandomElement(alternativeMovieNames);
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

const getAgeRating = () => {
  const getAgeRatings = [
    '0+',
    '6+',
    '13+',
    '17+',
    '18+',
  ];
  return getRandomElement(getAgeRatings);
};

const getMoviePoster = () => {
  const path = `./images/posters/${getRandomInteger(1,7)}.jpg`;
  return path;
};

const getMovieRating = () => getRandomNumber(4);

const getMovieYear = () => getRandomDate(1929, 1990);

const getMovieLength = () => {
  const movieTime = `${getRandomInteger(1, 3)}h ${getRandomInteger(0, 59)}m`;
  return movieTime;
};

const getMovieDirector = () => {
  const directors = [
    'Steven Spielberg',
    'Martin Scorsese',
    'Christopher Nolan',
    'Quentin Tarantino',
    'James Cameron',
    'Alfred Hitchcock',
    'Stanley Kubrick',
    'Ridley Scott',
    'Peter Jackson',
    'Francis Ford Coppola',
    'David Fincher',
    'Wes Anderson',
    'Joel Coen',
    'George Lucas',
    'Tim Burton'
  ];
  return getRandomElement(directors);
};

const getMovieActors = () => {
  const actors = [
    'Leonardo DiCaprio',
    'Robert De Niro',
    'Tom Hanks',
    'Denzel Washington',
    'Brad Pitt',
    'Johnny Depp',
    'Morgan Freeman',
    'George Clooney',
    'Al Pacino',
    'Will Smith',
    'Matt Damon',
    'Samuel L. Jackson',
    'Robert Downey Jr.',
    'Christian Bale',
    'Anthony Hopkins'
  ];
  const selectedActors = getRandomSubset(actors, getRandomInteger(1, MAX_AMOUNT_OF_ACTORS));
  return selectedActors;
};

const getMovieCountry = () => {
  const countries = [
    'United States',
    'Canada',
    'Brazil',
    'United Kingdom',
    'Germany',
    'France',
    'Italy',
    'Spain',
    'Japan',
    'Australia'
  ];
  return getRandomElement(countries);
};

const getMovieWriters = () => {
  const writers = [
    'Christopher Nolan',
    'Quentin Tarantino',
    'Aaron Sorkin',
    'Charlie Kaufman',
    'David Mamet',
    'Steven Zaillian',
    'Paul Schrader',
    'William Goldman',
    'John August',
    'Jane Goldman',
    'Richard Curtis',
    'Nora Ephron',
    'John Logan',
    'Wes Anderson',
    'Coen Brothers'
  ];
  const selectedWriters = getRandomSubset(writers, getRandomInteger(1, MAX_AMOUNT_OF_WRITERS));
  return selectedWriters;
};

export const generateMovie = () => {
  const alreadyWatched = getRandomBoolean();
  return {
    id: nanoid(),
    comments: getMovieComments(),
    filmInfo: {
      title: getMovieName(),
      altTitle: getAlternativeMovieName(),
      rating: getMovieRating(),
      poster: getMoviePoster(),
      ageRating: getAgeRating(),
      director: getMovieDirector(),
      writers: getMovieWriters(),
      actors: getMovieActors(),
      year: getMovieYear(),
      country: getMovieCountry(),
      duration: getMovieLength(),
      genre: getMovieGenre(),
      description: getMovieDescription(),
    },
    userDetails: {
      watchlist: getRandomBoolean(),
      alreadyWatched: alreadyWatched,
      watchingDate: alreadyWatched  ? getCurrentTime() : null,
      favorite: getRandomBoolean(),
    },
  };};

