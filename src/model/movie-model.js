import Observable from '../framework/observable.js';
import { UpdateType } from '../utils/const.js';
export default class movieModel extends Observable {
  #movies = [];
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

  addMovieComment = async (updateType, update, createdComment) => {
    try {
      const response = await this.#moviesApiService.addComment(update, createdComment);
      this.#comments = response.comments;

      this.#updateOnClient({
        updateType,
        update: response.movie,
        isAdapted: false,
      });

      this._notify(UpdateType.EXTRA);
    }  catch (err) {
      throw new Error('Can\'t add comment');
    }
  };

  #updateOnClient = async ({updateType, update, isAdapted}) => {
    const index = this.#movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    const updatedMovie = (!isAdapted) ? this.#adaptToClient(update) : update;

    this.#movies = [
      ...this.#movies.slice(0, index),
      updatedMovie,
      ...this.#movies.slice(index + 1),
    ];
    this._notify(updateType, updatedMovie);
  };

  updateOnServer = async (updateType, update) => {
    const index = this.#movies.findIndex((movie) => movie.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    try {
      const response = await this.#moviesApiService.updateMovie(update);
      const updatedMovie = this.#adaptToClient(response);

      this.#movies = [
        ...this.#movies.slice(0, index),
        updatedMovie,
        ...this.#movies.slice(index + 1),
      ];
      this._notify(updateType, updatedMovie);
    } catch {
      throw new Error('Can\'t update movie');
    }
  };

  deleteMovieComment = async (updateType, update, deletedComment) => {
    const index = this.#comments.findIndex(
      (comment) => comment.id === deletedComment.id
    );

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      await this.#moviesApiService.deleteComment(deletedComment);

      const updateMovie = {
        ...update,
        comments: [
          ...update.comments.slice(0, index),
          ...update.comments.slice(index + 1)
        ]
      };

      this.#updateOnClient({
        updateType,
        update: updateMovie,
        isAdapted: true
      });

      this._notify(UpdateType.EXTRA);
    } catch (err) {
      throw new Error('Can\'t delete comment');
    }
  };

  #adaptToClient = (movie) => {
    const filmInfo = {
      ...movie.film_info,
      altTitle: movie.film_info.alternative_title,
      rating: movie.film_info.total_rating,
      ageRating: movie.film_info.age_rating,
      year: movie.film_info.release.date,
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
