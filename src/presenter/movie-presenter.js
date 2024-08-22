import { render } from '../framework/render.js';
import FilmView from '../view/film-view.js';
// import FilmsContainerView from '../view/films-container-view.js';
import PopupView from '../view/popup-view.js';
import CommentView from '../view/comment-view.js';
import PopupCommentContainerView from '../view/popup-comment-container-view.js';
import PopupCommentsView from '../view/comments-list-view.js';
import PopupCommentswrapperView from '../view/comments-wrapper-view.js';
import NewCommentView from '../view/new-comment-view.js';
import { isEscapeKey } from '../utils/utils.js';

export default class MoviePresenter {
  #movie = null;
  #movieContainer = null;
  #popupComponent = null;
  #commentComponent = null;
  #newCommentComponent = null;
  #commentContainer = null;
  #popupCommentsWrapperComponent = null;
  #popupCommentsListComponent = null;

  #comments = [];

  constructor (movieContainer) {
    this.#movieContainer = movieContainer;
  }

  init = (movie) => {
    this.#movie = movie;
    this.#newCommentComponent = new NewCommentView();
    this.#commentContainer = new PopupCommentContainerView();
    this.#popupCommentsWrapperComponent = new PopupCommentswrapperView();
    this.#popupCommentsListComponent = new PopupCommentsView();
    this.#renderMovie(movie);
  };

  #renderMovie = (movie) => {
    const movieComponent = new FilmView(movie);
    render(movieComponent, this.#movieContainer.element);

    movieComponent.setMovieClickHandler(() => this.#renderMoviePopup(movie));
  };

  #renderMoviePopup = (movie) => {
    const closePopup = () => {
      if (this.#popupComponent) {
        this.#popupComponent.element.remove();
        this.#popupComponent = null;
        this.#popupCommentsWrapperComponent.element.remove();
        this.#popupCommentsWrapperComponent = null;
        if (this.#commentComponent) {
          this.#commentComponent.element.remove();
          this.#commentComponent = null;
        }
        document.body.classList.remove('hide-overflow');
      }
    };

    const onEscKeydown = (evt) => {
      if (isEscapeKey(evt) && this.#popupComponent) {
        closePopup();
        document.removeEventListener('keydown', onEscKeydown);
      }
    };

    const onCloseButtonClick = () => {
      closePopup();
      document.removeEventListener('keydown', onEscKeydown);
    };

    const renderComment = () => {
      this.#comments = movie.comments;

      for (let i = 0; i < this.#comments.length; i++) {
        this.#commentComponent = new CommentView(this.#comments[i]);
        render(this.#commentComponent, this.#popupCommentsListComponent.element);
      }
    };

    const renderPopup = () => {
      if (!this.#popupComponent) {
        this.#popupComponent = new PopupView(movie);
        this.#popupCommentsWrapperComponent = new PopupCommentswrapperView(movie);
      }
      render(this.#popupComponent, this.#movieContainer.element);
      render(this.#commentContainer, this.#popupComponent.element);
      render(this.#popupCommentsWrapperComponent, this.#commentContainer.element);
      render(this.#popupCommentsListComponent,this.#popupCommentsWrapperComponent.element);

      render(this.#newCommentComponent, this.#popupComponent.element);
      document.body.classList.add('hide-overflow');
      this.#popupComponent.setPopupClickHandler(() => {
        onCloseButtonClick();
      });
      document.addEventListener('keydown', onEscKeydown);
    };

    renderPopup();
    renderComment();
  };
}
