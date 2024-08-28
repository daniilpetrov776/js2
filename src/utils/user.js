export const calculateWatchedMovies = (movies) => movies.filter((movie) => movie.userDetails.alreadyWatched);

export const getUserRank = (moviesWatched) => {
  const count = moviesWatched.length;

  if (count === 0) {
    return null;
  } else if (count >= 1 && count <= 10) {
    return 'novice';
  } else if (count >= 11 && count <= 20) {
    return 'fan';
  } else if (count >= 21) {
    return 'movie buff';
  }
};
