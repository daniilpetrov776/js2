import {remove, render, replace} from '../framework/render.js';
import FilmView from '../view/film-view.js';
import PopupView from '../view/popup-view.js';
import { isEscapeKey } from '../utils/utils.js';
import CommentsPresenter from './comments-presenter.js';

// const Mode = {
//   DEFAULT: 'DEFAULT',
//   WATCHLIST: 'WATCHLIST',
//   WATCHED: 'WATCHED',
//   FAVORITE: 'FAVORITE',
// };

// const movieState = {
//   [Mode.WATCHLIST]: false,
//   [Mode.WATCHED]: false,
//   [Mode.FAVORITE]: false,
// };
export default class MoviePresenter {
  #movie = null;
  #movieContainer = null;
  #popupComponent = null;
  #commentsPresenter = null;
  #movieComponent = null;
  #changeData = null;

  constructor (movieContainer, changeData) {
    this.#movieContainer = movieContainer;
    this.#changeData = changeData;
    // this.changeMode = changeMode;
  }

  init = (movie) => {
    this.#movie = movie;

    const prevMovieComponent = this.#movieComponent;

    this.#movieComponent = new FilmView(movie);
    this.#movieComponent.setMovieClickHandler(() => this.#renderMoviePopup(movie));
    this.#movieComponent.setWatchListClickHandler(() => this.#handleWatchlistClick());
    this.#movieComponent.setWatchedClickHandler(() => this.#handleWatchedClick());
    this.#movieComponent.setFavoriteClickHandler(() => this.#handleFavoriteClick());

    if (prevMovieComponent === null) {
      render(this.#movieComponent, this.#movieContainer.element);
    } else {
      replace(this.#movieComponent, prevMovieComponent);
      remove(prevMovieComponent);
    }
    // console.log('инициализация')
  };

  destroy = () => {
    this.#closePopup();
    remove(this.#movieComponent);
  };

  // #updateView = () => {
  //   if (this.#mode !== Mode.DEFAULT) {
  //     this.init(this.#changeData);
  //     console.log('ОБНОВИЛОСЬ')
  //   }
  // };

  #handleWatchlistClick = () => {
    this.#changeData({
      ...this.#movie,
      userDetails: {
        ...this.#movie.userDetails,
        watchlist: !this.#movie.userDetails.watchlist
      },
    });
    console.log('watchlist', this.#movie)
  };

  #handleWatchedClick = () => {
    this.#changeData({
      ...this.#movie,
      userDetails: {
        ...this.#movie.userDetails,
        alreadyWatched: !this.#movie.userDetails.alreadyWatched
      },
    });
    console.log('watched', this.#movie)

  };

  #handleFavoriteClick = () => {
    this.#changeData({
      ...this.#movie,
      userDetails: {
        ...this.#movie.userDetails,
        favorite: !this.#movie.userDetails.favorite
      },
    });
    console.log('favorite', this.#movie)
  };

  #closePopup = () => {
    if (this.#popupComponent) {
      remove(this.#popupComponent);
      this.#popupComponent = null;
      this.#commentsPresenter.remove();
      this.#commentsPresenter = null;
      document.body.classList.remove('hide-overflow');
    }
  };

  #onCloseButtonClick = () => {
    this.#closePopup();
    document.removeEventListener('keydown', this.#onEscKeydown);
  };

  #onEscKeydown = (evt) => {
    if (isEscapeKey(evt) && this.#popupComponent) {
      this.#closePopup();
      document.removeEventListener('keydown', this.#onEscKeydown);
    }
  };

  #renderMoviePopup = (movie) => {
    if (!this.#popupComponent) {
      this.#popupComponent = new PopupView(movie);
      this.#commentsPresenter = new CommentsPresenter(this.#popupComponent);

      render(this.#popupComponent, this.#movieContainer.element);
      document.body.classList.add('hide-overflow');

      this.#popupComponent.setPopupClickHandler(() => {
        this.#onCloseButtonClick();
      });
      document.addEventListener('keydown', this.#onEscKeydown);

      this.#commentsPresenter.init(movie);
      console.log(this.#movie)
    }
  };
}

