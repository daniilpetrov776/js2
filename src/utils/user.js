export const getUserRank = (movies) => {
  const WatchedMoviesCount = movies.filter((movie) => movie.userDetails.alreadyWatched).length;

  if (WatchedMoviesCount === 0) {
    return null;
  } else if (WatchedMoviesCount >= 1 && WatchedMoviesCount <= 10) {
    return 'novice';
  } else if (WatchedMoviesCount >= 11 && WatchedMoviesCount <= 20) {
    return 'fan';
  } else if (WatchedMoviesCount >= 21) {
    return 'movie buff';
  }
};
