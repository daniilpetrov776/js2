import { render } from '../framework/render.js';
import FilmView from '../view/film-view.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import PopupView from '../view/popup-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import EmptyFeedView from '../view/empty-feed-view.js';
import { isEscapeKey } from '../utils.js';

const MOVIES_PER_STEP = 5;
export default class MovieFeedPresenter {
  #films = new FilmsView();
  #filmsList = new FilmsListView();
  #filmsContainer = new FilmsContainerView();
  #loadMoreMoviesComponent = new ShowMoreButtonView();
  #siteElement = null;
  #movieModel = null;
  #popupComponent = null;

  #movies = [];
  #renderMoviesCount = MOVIES_PER_STEP;

  constructor (siteElement, movieModel) {
    this.#siteElement = siteElement;
    this.#movieModel = movieModel;
  }

  init = () => {
    this.#movies = [...this.#movieModel.movies];
    this.#renderFeed();
  };

  #renderFeed = () => {
    render(this.#films, this.#siteElement);
    render(this.#filmsList, this.#films.element);
    render(this.#filmsContainer, this.#filmsList.element);

    for (let i = 0; i < Math.min(this.#movies.length, MOVIES_PER_STEP); i++) {
      this.#renderMovie(this.#movies[i]);
    }

    if (this.#movies.length === 0) {
      this.#renderEmptyFeed();
    }

    if (this.#movies.length > MOVIES_PER_STEP) {
      render(this.#loadMoreMoviesComponent, this.#siteElement);

      this.#loadMoreMoviesComponent.element.addEventListener('click', this.#onShowMoreButtonClick);
    }
  };

  #onShowMoreButtonClick = (evt) => {
    evt.preventDefault();
    this.#movies
      .slice(this.#renderMoviesCount, this.#renderMoviesCount + MOVIES_PER_STEP)
      .forEach((movie) => this.#renderMovie(movie));

    this.#renderMoviesCount += MOVIES_PER_STEP;

    if (this.#renderMoviesCount >= this.#movies.length) {
      this.#loadMoreMoviesComponent.element.remove();
      this.#loadMoreMoviesComponent.removeElement();
    }
  };

  #renderEmptyFeed = () => {
    const emptyMessageComponent = new EmptyFeedView();

    render(emptyMessageComponent, this.#films.element);
  };

  #renderMovie = (movie) => {
    const movieComponent = new FilmView(movie);

    render(movieComponent, this.#filmsContainer.element);

    movieComponent.element.querySelector('.film-card__poster').addEventListener('click', () => {
      this.#renderMoviePopup(movie);
    });
  };

  #renderMoviePopup = (movie) => {

    const closePopup = () => {
      if (this.#popupComponent) {
        this.#popupComponent.element.remove();
        document.body.classList.remove('hide-overflow');
        this.#popupComponent = null;
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

    const renderPopup = () => {
      if (!this.#popupComponent) {
        this.#popupComponent = new PopupView(movie);
      }
      render(this.#popupComponent,this.#filmsContainer.element);
      document.body.classList.add('hide-overflow');
      this.#popupComponent.element.querySelector('.film-details__close-btn').addEventListener('click', onCloseButtonClick);
      document.addEventListener('keydown', onEscKeydown);
    };

    renderPopup();
  };
}
