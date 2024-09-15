import { generateMovie } from '../mock/mock.js';
import { getAllComments } from '../mock/comments.js';
import Observable from '../framework/observable.js';
// import dateToY from '../utils/tasks.js';

const FILM_COUNT = 18;

export default class movieModel extends Observable {
  #movies = Array.from({length: FILM_COUNT}, (_, index) => generateMovie(index));
  #allComments = [];
  #comments = [];
  #moviesApiService = null;
  #test = [];
  constructor(moviesApiService) {
    super();
    this.#moviesApiService = moviesApiService;
    this.#moviesApiService.movies.then((movies) => {
      console.log(movies.map(this.#adaptToClient));
    });
    this.#pushAllComments();
  }

  #pushAllComments = () => {
    this.#allComments = getAllComments();
  };

  getCurrentcomments = (movie) => {
    this.#comments = movie.comments.map((commentId) =>
      this.#allComments.find((comment) =>
        comment.id === commentId)
    );
    return this.#comments;
  };

  get = () => this.#movies;

  updateMovie = (updateType, update) => {

    const index = this.#movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    this.#movies = [
      ...this.#movies.slice(0, index),
      update,
      ...this.#movies.slice(index + 1),
    ];

    this._notify(updateType, update);
  };

  addMovieComment = (updateType, update) => {
    console.log(update.comments)
    this.#allComments.push(update.comments[update.comments.length - 1]);
    this._notify(updateType, update);
  };

  deleteMovieComment = (updateType, update) => {
    console.log(update)
    console.log(update.deletedComment)
    console.log(this.#allComments)
    const index = this.#allComments.findIndex(
      (comment) => comment.id === update.deletedComment.id
    );

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this.#allComments = [
      ...this.#allComments.slice(0, index),
      ...this.#allComments.slice(index + 1),
    ];

    this._notify(updateType, update);
  };

  #adaptToClient = (movie) => {
    const filmInfo = {
      ...movie.film_info,
      altTitle: movie.film_info.alternative_title,
      rating: movie.film_info.total_rating,
      ageRating: movie.film_info.age_rating,
      year: movie.film_info.release.date,
      // year: movie.film_info.release.date !== null ? new Date(movie.film_info.release.date) : movie.film_info.release.date,
      country: movie.film_info.release.release_country,
      duration: movie.film_info.runtime,
    };

    delete filmInfo['alternative_title'];
    delete filmInfo['total_rating'];
    delete filmInfo['age_rating'];
    delete filmInfo['release'];
    delete filmInfo['runtime'];

    const userDetails = {
      ...movie.user_details,
      alreadyWatched: movie.user_details.already_watched,
      watchingDate: movie.user_details.watching_date,
    };

    delete userDetails['already_watched'];
    delete userDetails['watching_date'];

    const adaptedMovie = {...movie,
      filmInfo,
      userDetails,
    };

    delete adaptedMovie['film_info'];
    delete adaptedMovie['user_details'];

    return adaptedMovie;
  };
}
