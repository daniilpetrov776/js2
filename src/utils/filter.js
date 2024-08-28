const filterType = {
  ALL: 'all',
  WATCHLIST: 'Watchlist',
  HISTORY: 'History',
  FAVORITES: 'Favorites'
};

export const filter =  {
  [filterType.ALL]: (movies) => [...movies],
  [filterType.WATCHLIST]: (movies) => movies.filter((movie) => movie.userDetails.watchlist),
  [filterType.HISTORY]: (movies) => movies.filter((movie) => movie.userDetails.alreadyWatched),
  [filterType.FAVORITES]: (movies) => movies.filter((movie) => movie.userDetails.favorite),
};
