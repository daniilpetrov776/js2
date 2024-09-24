import AbstractView from '../framework/view/abstract-view.js';

const createNewTopRatedListTemplate = () => `
      <div class="films-list__container">

      </div>
`;

export default class TopRatedListView extends AbstractView {
  get template() {
    return createNewTopRatedListTemplate();
  }
}

