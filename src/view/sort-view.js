import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../utils/const.js';

const createNewSortTemplate = (sortType) => (`<ul class="sort">
    <li><a href="#" class="sort__button
    ${(sortType === 'default') ? 'sort__button--active' : ''}"
    data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button
    ${(sortType === 'date') ? 'sort__button--active' : ''}"
    data-sort-type="${SortType.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button
    ${(sortType === 'rating') ? 'sort__button--active' : ''}"
    data-sort-type="${SortType.RATING}">Sort by rating</a></li>
  </ul>
`);

export default class SortView extends AbstractView {
  #sortType = null;

  constructor(sortType) {
    super();
    this.#sortType = sortType;
  }

  get template() {
    return createNewSortTemplate(this.#sortType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };
}
