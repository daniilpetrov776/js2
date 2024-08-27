import {remove, render, replace} from '../framework/render.js';
import FilmView from '../view/film-view.js';
// import PopupView from '../view/popup-view.js';
// import { isEscapeKey } from '../utils/utils.js';
// import PopupPresenter from './popup-presenter.js';

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
  #popupPresenter = null;
  #movieComponent = null;
  #changeData = null;
  #moviePopup = null;

  constructor (movieContainer, changeData, moviePopup) {
    this.#movieContainer = movieContainer;
    this.#changeData = changeData;
    this.#moviePopup = moviePopup;
    // this.changeMode = changeMode;
  }

  init = (movie) => {
    this.#movie = movie;

    const prevMovieComponent = this.#movieComponent;

    this.#movieComponent = new FilmView(movie);
    this.#movieComponent.setMovieClickHandler(() => this.#moviePopup(movie));
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
    // this.#closePopup();
    remove(this.#movieComponent);
  };

  #handleWatchlistClick = () => {
    this.#changeData({
      ...this.#movie,
      userDetails: {
        ...this.#movie.userDetails,
        watchlist: !this.#movie.userDetails.watchlist
      },
    });
    // console.log('watchlist', this.#movie)
  };

  #handleWatchedClick = () => {
    this.#changeData({
      ...this.#movie,
      userDetails: {
        ...this.#movie.userDetails,
        alreadyWatched: !this.#movie.userDetails.alreadyWatched
      },
    });
    // console.log('watched', this.#movie)

  };

  #handleFavoriteClick = () => {
    this.#changeData({
      ...this.#movie,
      userDetails: {
        ...this.#movie.userDetails,
        favorite: !this.#movie.userDetails.favorite
      },
    });
    // console.log('favorite', this.#movie)
  };
}
