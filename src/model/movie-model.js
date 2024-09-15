// import { generateMovie } from '../mock/mock.js';
// import { getAllComments } from '../mock/comments.js';
import Observable from '../framework/observable.js';
import { UpdateType } from '../utils/const.js';
// import dateToY from '../utils/tasks.js';

// const FILM_COUNT = 18;

export default class movieModel extends Observable {
  // #movies = Array.from({length: FILM_COUNT}, (_, index) => generateMovie(index));
  #movies = [];
  #allComments = [];
  #comments = [];
  #moviesApiService = null;

  constructor(moviesApiService) {
    super();
    this.#moviesApiService = moviesApiService;
  }


  init = async () => {
    try {
      const movies = await this.#moviesApiService.movies;
      this.#movies = movies.map(this.#adaptToClient);
    } catch (err) {
      this.#movies = [];
    }
    this._notify(UpdateType.INIT);
  };

  getCurrentcomments = async (movie) => {
    this.#comments = await this.#moviesApiService.getComments(movie);
    return this.#comments;
  };

  get = () => this.#movies;

  updateMovie = async (updateType, update) => {

    const index = this.#movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }
    try {
      const response = await this.#moviesApiService.updateMovie(update);
      const updatedMovie = this.#adaptToClient(response);
      this.#movies = [
        ...this.#movies.slice(0, index),
        update,
        ...this.#movies.slice(index + 1),
      ];
      this._notify(updateType, updatedMovie);
    } catch(err) {
      throw new Error('Can\'t update movie');
    }
  };

  addMovieComment = (updateType, update) => {
    this.#allComments.push(update.comments[update.comments.length - 1]);
    this._notify(updateType, update);
  };

  deleteMovieComment = (updateType, update) => {
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
