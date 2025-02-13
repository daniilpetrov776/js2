// import AbstractView from '../framework/view/abstract-view.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { createNewCommentsTemplate } from './popup-comments-template.js';
import { createPopupFormTemplate } from './popup-form-template';
import { dateToMDY, minutesToTime } from '../utils/tasks.js';

const createNewPopupTemplate = (popup) => {
  const {filmInfo: {
    actors,
    ageRating,
    altTitle,
    country,
    description,
    director,
    writers,
    duration,
    genre,
    poster,
    rating,
    title,
    year},
  // comments,
  comment,
  checkedEmotion,
  userDetails: {
    watchlist,
    alreadyWatched,
    favorite,
  },
  currentComments,
  isCommentLoadingError,
  isDisabled,
  deleteCommentId
  } = popup;

  // console.log(isCommentLoadingError)
  console.log('айди удаления',deleteCommentId)
  return (`<section class="film-details">
  <div class="film-details__inner">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">

          <p class="film-details__age">${ageRating}</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">${altTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${dateToMDY(year)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${minutesToTime(duration)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genres</td>
              <td class="film-details__cell">
                <span class="film-details__genre">${genre}</span></td>
            </tr>
          </table>

          <p class="film-details__film-description">
          ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <button type="button" class="
        film-details__control-button
        film-details__control-button--watchlist
        ${(watchlist) ? 'film-details__control-button--active' : ''} " id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="
        film-details__control-button
        film-details__control-button--watched
        ${(alreadyWatched) ? 'film-details__control-button--active' : ''} " id="watched" name="watched">Already watched</button>
        <button type="button" class="
        film-details__control-button
        film-details__control-button--favorite
        ${(favorite) ? 'film-details__control-button--active' : ''} " id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>
    <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">
              ${((!isCommentLoadingError) ? `Comments <span class="film-details__comments-count">${popup.comments.length}</span>` : 'Error loading comments')}
            </h3>

            ${(!isCommentLoadingError) ?  createNewCommentsTemplate(currentComments, deleteCommentId) : ''}


            ${createPopupFormTemplate(checkedEmotion, comment, isCommentLoadingError, isDisabled)}

          </section>
        </div>
  </div>
</section>
`);
};
export default class PopupView extends AbstractStatefulView {


  constructor(popup, movieData, updateMovieData, comments, isCommentLoadingError) {
    // console.log(popup)
    // console.log(movieData)
    // console.log(updateMovieData)
    // console.log(comments)
    // console.log(isCommentLoadingError)
    super();
    this._state = PopupView.parsePopupToState(
      popup,
      comments,
      movieData.emotion,
      movieData.comment,
      movieData.scrollPosition,
      updateMovieData,
      isCommentLoadingError);
    this.updateMovieData = updateMovieData;

    if (!isCommentLoadingError) {
      this.#setInnerHandlers();
    }
  }

  get template() {
    console.log(this._state)
    return createNewPopupTemplate(this._state);
  }

  _restoreHandlers = () => {
    this.setScrollPosition();
    this.setPopupClickHandler(this._callback.click);
    this.setWatchListClickHandler(this._callback.watchlistClick);
    this.setWatchedClickHandler(this._callback.watchClick);
    this.setFavoriteClickHandler(this._callback.favorite);

    if (!this._state.isCommentLoadingError && !this._state.isDisabled) {
      this.setCommentDeleteClickHandler(this._callback.commentDeleteClick);
      this.#setInnerHandlers();
    }
  };

  #setInnerHandlers = () => {
    this.element .querySelectorAll('.film-details__emoji-label').forEach((element) => {
      element.addEventListener('click', this.#commentEmotionHandler);
    });
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#commentInputHandler);
  };

  setCommentData = () => {
    this.#updateData();
  };

  setCommentDeleteClickHandler = (callback) => {
    const commentsDelete = this.element.querySelectorAll('.film-details__comment-delete');

    if (commentsDelete) {
      this._callback.commentDeleteClick = callback;
      commentsDelete.forEach(
        (element) => element.addEventListener('click', this.#commentDeleteClickHandler, true)
      );
    }
  };

  shakeComment = (commentId) => {
    const comment = this.element.querySelector(`li[data-comment-id='${commentId}']`);
    // console.log(commentId)
    // console.log(this.element)
    // console.log(comment)
    this.shake.call({element: comment});
  };

  shakeForm = () => {
    const form = this.element.querySelector('.film-details__new-comment');
    this.shake.call({element: form});
  };

  shakeControls = () => {
    const controls = this.element.querySelector('.film-details__controls');
    this.shake.call({element: controls});
  };

  #commentEmotionHandler = (evt) => {
    evt.preventDefault();
    this.#updateData();
    this.updateElement({
      checkedEmotion: evt.currentTarget.closest('.film-details__emoji-label').dataset.emotion,
      scrollPosition: this.element.scrollTop
    });
  };

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this.#updateData();
    this._setState({
      comment: evt.target.value
    });
  };

  #updateData = () => {
    this.updateMovieData({
      emotion: this._state.checkedEmotion,
      comment: this._state.comment,
      scrollPosition: this.element.scrollTop
    });
  };

  #commentDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#updateData();
    this._callback.commentDeleteClick(evt.target.dataset.commentId);
  };

  static parsePopupToState = (
    popup,
    currentComments,
    checkedEmotion = null,
    comment = null,
    scrollPosition = 0,
    updateData,
    isCommentLoadingError = false,
  ) => ({...popup,
    checkedEmotion,
    comment,
    scrollPosition,
    updateData,
    currentComments,
    isCommentLoadingError,
    isDisabled: false,
    deleteCommentId: null,
    ifMovieEditing: false,
  });

  static parseStateToPupup = (state) => {
    const popup = {...state};
    return popup;
  };

  setScrollPosition = () => {
    this.element.scrollTop = this._state.scrollPosition;
  };

  setPopupClickHandler = (callback) => {
    this._callback.click = callback;

    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#popupClickHandler);
  };

  setWatchListClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler);
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favorite = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  #popupClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this.#updateData();
    this._callback.watchlistClick();
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this.#updateData();
    this._callback.watchClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#updateData();
    this._callback.favorite();
  };
}
