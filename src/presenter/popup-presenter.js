import { render, replace, remove } from '../framework/render.js';
import { isEscapeKey } from '../utils/utils.js';
import CommentView from '../view/comment-view.js';
import PopupCommentsView from '../view/comments-list-view.js';
import PopupCommentContainerView from '../view/popup-comment-container-view.js';
import PopupCommentswrapperView from '../view/comments-wrapper-view.js';
import NewCommentView from '../view/new-comment-view.js';
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

    this.#renderComments();
  };

  destroy = () => {
    if (this.#popupComponent) {
      remove(this.#popupComponent);
    }
  };

  #renderComments = () => {
    const commentContainer = new PopupCommentContainerView();
    const popupCommentsWrapperComponent = new PopupCommentswrapperView(this.#movie);
    const popupCommentsListComponent = new PopupCommentsView();
    const newCommentComponent = new NewCommentView();

    render(commentContainer, this.#popupComponent.element);
    render(popupCommentsWrapperComponent, commentContainer.element);
    render(popupCommentsListComponent, popupCommentsWrapperComponent.element);
    render(newCommentComponent, popupCommentsWrapperComponent.element);

    this.#movie.comments.forEach((comment) => {
      render(new CommentView(comment), popupCommentsListComponent.element);
    });
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
    this.#changeData({
      ...this.#movie,
      userDetails: {
        ...this.#movie.userDetails,
        [detail]: !this.#movie.userDetails[detail]
      },
    });
  };
}
