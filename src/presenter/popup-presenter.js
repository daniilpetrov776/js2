import { render, replace, remove } from '../framework/render.js';
import { isEscapeKey } from '../utils/utils.js';
import { UserAction, UpdateType } from '../utils/const.js';
import PopupView from '../view/popup-view.js';

export default class PopupPresenter {
  #movie = null;
  #popupComponent = null;
  #container = null;
  #removePopup = null;
  #changeData = null;
  #currentSortType = null;

  constructor (container, removePopup, changeData) {
    this.#container = container;
    this.#removePopup = removePopup;
    this.#changeData = changeData;
  }

  init = (movie, currentSortType) => {
    this.#movie = movie;
    this.#currentSortType = currentSortType;

    const prevPopupComponent = this.#popupComponent;
    this.#popupComponent = new PopupView(movie);

    document.addEventListener('keydown', this.#onEscKeydown);
    this.#setupPopupHandlers();

    if (prevPopupComponent === null) {
      render(this.#popupComponent, this.#container.element);
    } else {
      replace(this.#popupComponent, prevPopupComponent);
      remove(prevPopupComponent);
    }
  };

  destroy = () => {
    if (this.#popupComponent) {
      remove(this.#popupComponent);
    }
  };

  #setupPopupHandlers = () => {
    this.#popupComponent.setPopupClickHandler(this.#onCloseButtonClick);
    this.#popupComponent.setWatchListClickHandler(this.#toggleUserDetail.bind(this, 'watchlist'));
    this.#popupComponent.setWatchedClickHandler(this.#toggleUserDetail.bind(this, 'alreadyWatched'));
    this.#popupComponent.setFavoriteClickHandler(this.#toggleUserDetail.bind(this, 'favorite'));
  };

  #onCloseButtonClick = () => {
    this.#removePopup();
    document.removeEventListener('keydown', this.#onEscKeydown);
  };

  #onEscKeydown = (evt) => {
    if (isEscapeKey(evt)) {
      this.#removePopup();
    }
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
