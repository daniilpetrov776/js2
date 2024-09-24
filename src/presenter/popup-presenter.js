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
  #comments = null;

  #movieData = {
    emotion: null,
    comment: null,
    scrollPosition: 0
  };

  constructor (container, removePopup, changeData) {
    this.#container = container;
    this.#removePopup = removePopup;
    this.#changeData = changeData;
  }

  init = (movie, comments, isCommentsLoadingError) => {
    this.#movie = movie;
    this.#comments = (!isCommentsLoadingError) ? comments : [];

    const prevPopupComponent = this.#popupComponent;
    this.#popupComponent = new PopupView(this.#movie, this.#movieData, this.#updateMovieData, this.#comments, isCommentsLoadingError);
    this.#popupComponent.setPopupClickHandler(this.#onCloseButtonClick);
    this.#popupComponent.setWatchListClickHandler(this.#toggleUserDetail.bind(this, 'watchlist'));
    this.#popupComponent.setWatchedClickHandler(this.#toggleUserDetail.bind(this, 'alreadyWatched'));
    this.#popupComponent.setFavoriteClickHandler(this.#toggleUserDetail.bind(this, 'favorite'));

    if (!isCommentsLoadingError) {
      this.#popupComponent.setCommentDeleteClickHandler(this.#commentDeleteClickHandler);
    }

    document.addEventListener('keydown', this.#onEscKeydown);

    if (prevPopupComponent === null) {
      render(this.#popupComponent, this.#container);
      return;
    }

    replace(this.#popupComponent, prevPopupComponent);

    this.#popupComponent.setScrollPosition();

    remove(prevPopupComponent);
  };

  destroy = () => {
    if (this.#popupComponent) {
      remove(this.#popupComponent);
    }
  };

  clearMovieData = () => {
    this.#updateMovieData({
      comment: null,
      emotion: null,
      scrollPosition: this.#movieData.scrollPosition
    });

    this.#popupComponent.updateElement({
      checkedEmotion: this.#movieData.emotion,
      comment: this.#movieData.comment,
      scrollPosition: this.#movieData.scrollPosition
    });
  };

  createComment = () => {
    this.#popupComponent.setCommentData();
    const {emotion, comment} = this.#movieData;

    if (emotion && comment) {
      this.#changeData(
        UserAction.ADD_COMMENT,
        UpdateType.PATCH,
        this.#movie,
        {emotion, comment}
      );
    }
  };

  #updateMovieData = (movieData) => {
    this.#movieData = {...movieData};
  };

  setCommentCreation = () => {
    this.#popupComponent.updateElement({
      ...this.#movieData,
      isDisabled: true,
      isCommentCreating: true,
    });
  };

  setCommentDeleting = (commmentId) => {
    this.#popupComponent.updateElement({
      ...this.#movieData,
      isDisabled: true,
      deleteCommentId: commmentId,
    });
  };

  setMovieEditing = () => {
    this.#popupComponent.updateElement({
      ...this.#movieData,
      isDisabled: true,
      isMovieEditing: true,
    });
  };

  setAborting = ({actionType, commentId}) => {
    this.#popupComponent.updateElement({
      ...this.#movieData,
      isDisabled: false,
      deleteCommentId: null,
      isMovieEditing: false,
    });

    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        this.#popupComponent.shakeControls();
        break;
      case UserAction.ADD_COMMENT:
        this.#popupComponent.shakeForm();
        break;
      case UserAction.DELETE_COMMENT:
        this.#popupComponent.shakeComment(commentId);
        break;
    }
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

  #commentDeleteClickHandler = (commentId) => {
    const deletedComment = this.#comments.find((comment) => comment.id === commentId);
    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      this.#movie,
      deletedComment
    );
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
