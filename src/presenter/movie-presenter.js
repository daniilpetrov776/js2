import {remove, render, replace} from '../framework/render.js';
import { UserAction, UpdateType } from '../utils/const.js';
import FilmView from '../view/film-view.js';
export default class MoviePresenter {
  #movie = null;
  #movieContainer = null;
  #movieComponent = null;
  #changeData = null;
  #moviePopup = null;

  constructor (movieContainer, changeData, moviePopup) {
    this.#movieContainer = movieContainer;
    this.#changeData = changeData;
    this.#moviePopup = moviePopup;
  }

  init = (movie) => {
    this.#movie = movie;

    const prevMovieComponent = this.#movieComponent;
    this.#movieComponent = new FilmView(this.#movie);

    this.#setupMovieHandlers();

    if (prevMovieComponent === null) {
      render(this.#movieComponent, this.#movieContainer.element);
    } else {
      replace(this.#movieComponent, prevMovieComponent);
      remove(prevMovieComponent);
    }
  };

  destroy = () => {
    remove(this.#movieComponent);
  };

  setMovieEditing = () => {
    this.#movieComponent.updateElement({isMovieEditing: true});
  };

  setAborting = () => {
    this.#movieComponent.updateElement({isMovieEditing: false});
    this.#movieComponent.shakeControls();
  };

  #setupMovieHandlers = () => {
    this.#movieComponent.setMovieClickHandler(() => this.#moviePopup(this.#movie));
    this.#movieComponent.setWatchListClickHandler(this.#toggleUserDetail.bind(this, 'watchlist'));
    this.#movieComponent.setWatchedClickHandler(this.#toggleUserDetail.bind(this, 'alreadyWatched'));
    this.#movieComponent.setFavoriteClickHandler(this.#toggleUserDetail.bind(this, 'favorite'));
  };

  #toggleUserDetail = (detail) => {
    // Универсальная функция для изменения поля userDetails
    this.#changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.PATCH,
      {
        ...this.#movie,
        userDetails: {
          ...this.#movie.userDetails,
          [detail]: !this.#movie.userDetails[detail]
        },
      });
  };
}
