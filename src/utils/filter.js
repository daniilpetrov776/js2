import { FilterType } from './const.js';

export const filter =  {
  [FilterType.ALL]: (movies) => [...movies],
  [FilterType.WATCHLIST]: (movies) => movies.filter((movie) => movie.userDetails.watchlist),
  [FilterType.HISTORY]: (movies) => movies.filter((movie) => movie.userDetails.alreadyWatched),
  [FilterType.FAVORITES]: (movies) => movies.filter((movie) => movie.userDetails.favorite),
};
