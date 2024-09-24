import {render, replace, remove} from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import {filter} from '../utils/filter.js';
import {FilterType, UpdateType} from '../utils/const.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #movieModel = null;
  #currentFilter = null;
  #filterComponent = null;

  constructor(filterContainer, filterModel, movieModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#movieModel = movieModel;

    this.#movieModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const movies = this.#movieModel.get();

    return [
      {
        type: FilterType.ALL,
        count: filter[FilterType.ALL](movies).length,
      },
      {
        type: FilterType.WATCHLIST,
        count: filter[FilterType.WATCHLIST](movies).length,
      },
      {
        type: FilterType.HISTORY,
        count: filter[FilterType.HISTORY](movies).length,
      },
      {
        type: FilterType.FAVORITES,
        count: filter[FilterType.FAVORITES](movies).length,
      },
    ];
  }

  init = () => {
    this.#currentFilter = this.#filterModel.get();
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;
    this.#filterComponent = new FilterView(filters, this.#currentFilter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.get === filterType) {
      return;
    }

    this.#filterModel.set(UpdateType.MAJOR, filterType);
  };
}
