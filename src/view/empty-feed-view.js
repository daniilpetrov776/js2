import { createElement } from '../render.js';

const createEmptyFeedTemplate = () => '<h2 class="films-list__title">There are no movies in our database</h2>';

export default class EmptyFeedView {
  constructor(task) {
    this.task = task;
  }

  #element = null;

  get template() {
    return createEmptyFeedTemplate(this.task);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
