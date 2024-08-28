import { filter } from '../utils/filter.js';

export const generateFilter = (movies) => Object.entries(filter).map(
  ([filterName, filteredmovies]) => ({
    name: filterName,
    count: filteredmovies(movies)
  })
);

