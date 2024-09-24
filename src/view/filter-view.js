import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../utils/const.js';

const createFilterTemplate = ({type, count}, currentFilter) => {
  const getFilterName = (filterName) =>
    (filterName === FilterType.ALL) ?
      'All movies' : type;

  const getFilterTextContent = (filterName) =>
    (filterName !== FilterType.ALL) ?
      `<span class="main-navigation__item-count">${count}</span>` : '';

  return `
    <a
      href="#${type}"
      class="
        main-navigation__item
        ${(type === currentFilter) ? 'main-navigation__item--active' : ''}
      "
      data-filter-type=${type}
    >
      ${getFilterName(type)}
      ${getFilterTextContent(type)}
    </a>
    `;
};

const createFilterViewTemplate = (filters, currentFilter) => {
  const filterItems = filters.map((filter) => createFilterTemplate(filter, currentFilter)).join('');
  return `
      <nav class="main-navigation">
      ${filterItems}
    </nav>
    `;
};

export default class FilterView extends AbstractView{
  #filters = null;
  #filterType = null;

  constructor(filters, filterType) {
    super();
    this.#filters = filters;
    this.#filterType = filterType;
  }

  get template() {
    return createFilterViewTemplate(this.#filters, this.#filterType);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#filterClickHandler);
  };

  #filterClickHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();

    this._callback.click(evt.target.dataset.filterType);
  };
}
