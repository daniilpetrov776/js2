import { render } from '../render.js';
import FilmView from '../view/film-view.js';
import FilterView from '../view/filter-view.js';
import PopupView from '../view/popup-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import SortView from '../view/sort-view.js';
import FilmContainerView from '../view/films-container-view.js';

const AMOUNT_OF_FILMS_RENDERED = 5;

export default class MovieFeedPresenter {
  filmContainer = new FilmContainerView();
  filmList = this.filmContainer.getElement().querySelector('.films-list__container');

  init = (siteElement) => {
    this.siteElement = siteElement;

    render(new FilterView(), siteElement);
    render(new SortView(), siteElement);
    render(this.filmContainer, siteElement);

    for (let i = 0; i < AMOUNT_OF_FILMS_RENDERED; i++) {
      render(new FilmView(), this.filmList);
    }

    render(new ShowMoreButtonView(), siteElement);
    render(new PopupView(), siteElement);
  };
}
