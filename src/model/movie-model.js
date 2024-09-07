import { generateMovie } from '../mock/mock.js';
import Observable from '../framework/observable.js';
const FILM_COUNT = 18;

export default class movieModel extends Observable {
  #movies = Array.from({length: FILM_COUNT}, (_, index) => generateMovie(index));

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
    this.#movies = [
      update,
      ...this.#movies,
    ];

    this._notify(updateType, update);
  };

  deleteMovieComment = (updateType, update) => {
    const index = this.#movies.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this.#movies = [
      ...this.#movies.slice(0, index),
      ...this.#movies.slice(index + 1),
    ];

    this._notify(updateType);
  };
}
