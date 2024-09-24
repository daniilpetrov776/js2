import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../utils/const.js';

const NoMoviesTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const createEmptyFeedTemplate = (currentFilterType) => {
  const noMoviesTextValue = NoMoviesTextType[currentFilterType];
  return `<h2 class="films-list__title">${noMoviesTextValue}</h2>`;
};


export default class EmptyFeedView extends AbstractView {
  #currentFilterType = null;

  constructor(currentFilterType) {
    super();
    this.#currentFilterType = currentFilterType;
  }

  get template() {
    return createEmptyFeedTemplate(this.#currentFilterType);
  }
}
