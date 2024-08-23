import { remove, render } from '../framework/render.js';
import FilmView from '../view/film-view.js';
import PopupView from '../view/popup-view.js';
import { isEscapeKey } from '../utils/utils.js';
import CommentsPresenter from './comments-presenter.js';

export default class MoviePresenter {
  #movie = null;
  #movieContainer = null;
  #popupComponent = null;
  #commentsPresenter = null;
  #movieComponent = null;

  constructor (movieContainer) {
    this.#movieContainer = movieContainer;
  }

  init = (movie) => {
    this.#movie = movie;
    this.#renderMovie(movie);
  };

  destroy = () => {
    this.#closePopup();
    remove(this.#movieComponent);
  };

  #renderMovie = (movie) => {
    this.#movieComponent = new FilmView(movie);
    render(this.#movieComponent, this.#movieContainer.element);

    this.#movieComponent.setMovieClickHandler(() => this.#renderMoviePopup(movie));
  };

  #closePopup = () => {
    if (this.#popupComponent) {
      this.#popupComponent.element.remove();
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
    }
  };
}
