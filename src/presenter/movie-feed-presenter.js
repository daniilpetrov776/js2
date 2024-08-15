import { render } from '../render.js';
import FilmView from '../view/film-view.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import PopupView from '../view/popup-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import { isEscapeKey } from '../utils.js';
export default class MovieFeedPresenter {
  #films = new FilmsView();
  #filmsList = new FilmsListView();
  #filmsContainer = new FilmsContainerView();
  #siteElement = null;
  #movieModel = null;
  #popupComponent = null;

  #movies = [];

  init = (siteElement, movieModel) => {
    this.#siteElement = siteElement;
    this.#movieModel = movieModel;
    this.#movies = [...this.#movieModel.movies];

    render(this.#films, siteElement);
    render(this.#filmsList, this.#films.element);
    render(this.#filmsContainer, this.#filmsList.element);

    this.#movies.forEach(this.#renderMovie);

    render(new ShowMoreButtonView(), siteElement);
  };

  #renderMovie = (movie) => {
    const movieComponent = new FilmView(movie);

    const renderPopup = () => {
      render(this.#popupComponent,this.#filmsContainer.element);
    };

    const closePopup = () => {
      if (this.#popupComponent) {
        this.#popupComponent.element.remove();
        document.body.classList.remove('hide-overflow');
        this.#popupComponent = null;
        document.removeEventListener('keydown', onEscKeydown);
      }
    };

    const onCloseButtonClick = () => {
      closePopup();
    };

    function onEscKeydown () {
      if (isEscapeKey) {
        closePopup();
      }
    }

    const onMovieClick = () => {
      if (!this.#popupComponent) {
        this.#popupComponent = new PopupView(movie);
      }
      renderPopup();
      document.body.classList.add('hide-overflow');
      this.#popupComponent.element.querySelector('.film-details__close-btn').addEventListener('click', onCloseButtonClick);
      document.addEventListener('keydown', onEscKeydown);
    };

    movieComponent.element.querySelector('.film-card__poster').addEventListener('click', onMovieClick);

    render(movieComponent, this.#filmsContainer.element);
  };
}
