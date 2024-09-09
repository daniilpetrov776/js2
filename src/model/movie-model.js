import { generateMovie } from '../mock/mock.js';
import { getAllComments } from '../mock/comments.js';
import Observable from '../framework/observable.js';
const FILM_COUNT = 18;

export default class movieModel extends Observable {
  #movies = Array.from({length: FILM_COUNT}, (_, index) => generateMovie(index));
  #allComments = [];
  #comments = [];

  constructor() {
    super();
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
    this.#allComments.push(update);
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

    console.log(this.#allComments)
    this._notify(updateType, update);
  };
}
