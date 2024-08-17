import AbstractView from '../framework/view/abstract-view.js';

const createEmptyFeedTemplate = () => '<h2 class="films-list__title">There are no movies in our database</h2>';

export default class EmptyFeedView extends AbstractView {
  get template() {
    return createEmptyFeedTemplate(this.task);
  }
}
