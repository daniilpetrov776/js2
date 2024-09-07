import AbstractView from '../framework/view/abstract-view.js';

const createFilterTemplate = (filters) => {
  const watchlistCount = filters.find((filter) => filter.name === 'Watchlist')?.count.length || 0;
  const historyCount = filters.find((filter) => filter.name === 'History')?.count.length || 0;
  const favoritesCount = filters.find((filter) => filter.name === 'Favorites')?.count.length || 0;

  return (`<main class="main">
  <nav class="main-navigation">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchlistCount}</span></a>
    <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${historyCount}</span></a>
    <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favoritesCount}</span></a>
  </nav>`);
};

export default class FilterView extends AbstractView{
  constructor(filters) {
    super();
    this.filters = filters;
  }

  get template() {
    return createFilterTemplate(this.filters);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.main-navigation__item').addEventListener('click', this.#filterClickHandler);
  };

  #filterClickHandler = (evt) => {
    evt.preventDefault();
    this.callback.click();
  };
}
