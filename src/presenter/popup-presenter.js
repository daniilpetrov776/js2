import { render, replace, remove } from '../framework/render.js';
import { isEscapeKey } from '../utils/utils.js';
import { UserAction, UpdateType } from '../utils/const.js';
import PopupView from '../view/popup-view.js';
import { nanoid } from 'nanoid';

export default class PopupPresenter {
  #movie = null;
  // #comments = null;
  #popupComponent = null;
  #container = null;
  #removePopup = null;
  #changeData = null;
  #currentSortType = null;

  #movieData = {
    emotion: null,
    comment: null,
    scrollPosition: 0
  };

  // #updateMovieData = null;


  constructor (container, removePopup, changeData) {
    this.#container = container;
    this.#removePopup = removePopup;
    this.#changeData = changeData;
  }

  init = (movie, currentSortType) => {
    this.#movie = movie;
    // this.#updateMovieData = this.#updateMovieData()
    // this.#comments = movie.comments;
    this.#currentSortType = currentSortType;

    const prevPopupComponent = this.#popupComponent;
    this.#popupComponent = new PopupView(this.#movie, this.#movieData, this.#updateMovieData);

    document.addEventListener('keydown', this.#onEscKeydown);
    this.#setupPopupHandlers();

    if (prevPopupComponent === null) {
      render(this.#popupComponent, this.#container.element);
    } else {
      replace(this.#popupComponent, prevPopupComponent);

      this.#popupComponent.setScrollPosition();

      remove(prevPopupComponent);
    }
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
  };

  createComment = () => {
    this.#popupComponent.setCommentData();

    const {emotion, comment} = this.#movieData;

    if (emotion && comment) {
      const newCommentId = nanoid();

      const newComment = {
        id: newCommentId,
        author: 'Bob',
        date: new Date(),
        emotion,
        comment,
      };

      this.#changeData(
        UserAction.ADD_COMMENT,
        UpdateType.PATCH,
        {
          ...this.#movie,
          comments: [
            ...this.#movie.comments,
            newComment
          ]
        },

      );
      console.log(newComment)
    }
  };

  #updateMovieData = (movieData) => {
    this.#movieData = {...movieData};
    // console.log(movieData)
  };

  #setupPopupHandlers = () => {
    this.#popupComponent.setPopupClickHandler(this.#onCloseButtonClick);
    this.#popupComponent.setCommentDeleteClickHandler(this.#commentDeleteClickHandler);
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

  #commentDeleteClickHandler = (commentId) => {
    // const commentIdToNumber = Number(commentId);
    // console.log(commentId)
    const movieCommentIdIndex = this.#movie.comments.findIndex((movieComment) => movieComment.id === commentId);
    // console.log(movieCommentIdIndex)

    const deletedComment = this.#movie.comments.find((comment) => comment.id === commentId);
    console.log(deletedComment)
    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      {
        ...this.#movie,
        comments: [
          ...this.#movie.comments.slice(0, movieCommentIdIndex),
          ...this.#movie.comments.slice(movieCommentIdIndex + 1)
        ],
        deletedComment,
      },
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
