import AbstractView from '../framework/view/abstract-view.js';

const createFilterTemplate = (filters, currentFilterType) => {
  const watchlistCount = filters.find((filter) => filter.name === 'Watchlist')?.count || 0;
  const historyCount = filters.find((filter) => filter.name === 'History')?.count || 0;
  const favoritesCount = filters.find((filter) => filter.name === 'Favorites')?.count || 0;

  return (`<main class="main">
  <nav class="main-navigation">
    <a href="#all" class="main-navigation__item ${currentFilterType === 'all' ? 'main-navigation__item--active' : ''}">All movies</a>
    <a href="#watchlist" class="main-navigation__item ${currentFilterType === 'Watchlist' ? 'main-navigation__item--active' : ''}">Watchlist <span class="main-navigation__item-count">${watchlistCount}</span></a>
    <a href="#history" class="main-navigation__item ${currentFilterType === 'History' ? 'main-navigation__item--active' : ''}">History <span class="main-navigation__item-count">${historyCount}</span></a>
    <a href="#favorites" class="main-navigation__item ${currentFilterType === 'Favorites' ? 'main-navigation__item--active' : ''}">Favorites <span class="main-navigation__item-count">${favoritesCount}</span></a>
  </nav>`);
};

export default class FilterView extends AbstractView{
  #filters = null;
  #filterType = null;

  constructor(filters, filterType) {
    super();
    this.filters = filters;
    this.filterType = filterType;
  }

  get template() {
    return createFilterTemplate(this.filters, this.filterType);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.main-navigation').addEventListener('click', this.#filterClickHandler);
  };

  #filterClickHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();

    this._callback.click();
  };
}
