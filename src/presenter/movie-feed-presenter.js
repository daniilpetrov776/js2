import { render } from '../render.js';
import FilmView from '../view/film-view.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import PopupView from '../view/popup-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
export default class MovieFeedPresenter {
  #films = new FilmsView();
  #filmsList = new FilmsListView();
  #filmsContainer = new FilmsContainerView();
  #siteElement = null;
  #movieModel = null;

  #movies = [];

  init = (siteElement, movieModel) => {
    this.#siteElement = siteElement;
    this.#movieModel = movieModel;
    this.#movies = [...this.#movieModel.movies];

    render(this.#films, siteElement);
    render(this.#filmsList, this.#films.element);
    render(this.#filmsContainer, this.#filmsList.element);

    for (let i = 0; i < this.#movies.length; i++) {
      render(new FilmView(this.#movies[i]), this.#filmsContainer.element);
    }

    render(new ShowMoreButtonView(), siteElement);
    render(new PopupView(this.#movies[0]), siteElement);
  };
}
