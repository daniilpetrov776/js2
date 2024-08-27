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
  #commentComponent = null;
  #newCommentComponent = null;
  #commentContainer = null;
  #popupCommentsWrapperComponent = null;
  #popupCommentsListComponent = null;
  #container = null;
  #removePopup = null;
  #changeData = null;

  #comments = [];

  constructor (container, removePopup, changeData) {
    this.#container = container;
    this.#removePopup = removePopup;
    this.#changeData = changeData;
  }

  init = (movie) => {
    this.#movie = movie;

    const prevPopupComponent = this.#popupComponent;
    this.#popupComponent = new PopupView(movie);

    this.#popupComponent.setPopupClickHandler(() => {
      this.#onCloseButtonClick();
    });
    document.addEventListener('keydown', this.#onEscKeydown);
    this.#popupComponent.setWatchListClickHandler(() => this.#handleWatchlistClick());
    this.#popupComponent.setWatchedClickHandler(() => this.#handleWatchedClick());
    this.#popupComponent.setFavoriteClickHandler(() => this.#handleFavoriteClick());
    if (prevPopupComponent === null) {
      render(this.#popupComponent, this.#container.element);
    } else {
      replace(this.#popupComponent, prevPopupComponent);
      remove(prevPopupComponent);
    }


    this.#commentContainer = new PopupCommentContainerView();
    this.#popupCommentsWrapperComponent = new PopupCommentswrapperView(movie);
    this.#popupCommentsListComponent = new PopupCommentsView();
    this.#newCommentComponent = new NewCommentView();
    this.#renderComments();
  };

  destroy = () => {
    if (this.#popupComponent) {
      remove(this.#popupComponent);
      if (this.#commentComponent) {
        this.#popupCommentsWrapperComponent.element.remove();
        this.#popupCommentsWrapperComponent = null;
        this.#commentComponent.element.remove();
        this.#commentComponent = null;
      }
    }
  };

  #onCloseButtonClick = () => {
    this.#removePopup();
    document.removeEventListener('keydown', this.#onEscKeydown);
  };

  #closePopup = () => {
    this.#removePopup();
  };

  #onEscKeydown = (evt) => {
    if (isEscapeKey(evt)) {
      this.#closePopup();
      document.removeEventListener('keydown', this.#onEscKeydown);
    }
  };

  #renderComments = () => {
    this.#comments = this.#movie.comments;
    render(this.#commentContainer, this.#popupComponent.element);
    render(this.#popupCommentsWrapperComponent, this.#commentContainer.element);
    render(this.#popupCommentsListComponent,this.#popupCommentsWrapperComponent.element);
    render(this.#newCommentComponent, this.#popupCommentsWrapperComponent.element);

    for (let i = 0; i < this.#comments.length; i++) {
      this.#commentComponent = new CommentView(this.#comments[i]);
      render(this.#commentComponent, this.#popupCommentsListComponent.element);
    }
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
