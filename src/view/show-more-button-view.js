import AbstractView from '../framework/view/abstract-view.js';

const createNewShowMoreButtonTemplate = () => (`<button class="films-list__show-more">Show more</button>
`);

export default class ShowMoreButtonView extends AbstractView {
  get template() {
    return createNewShowMoreButtonTemplate();
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;

    this.element.addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}
