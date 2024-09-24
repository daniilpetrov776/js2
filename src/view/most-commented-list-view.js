import AbstractView from '../framework/view/abstract-view.js';

const createNewMostCommentedListTemplate = () => `
      <div class="films-list__container">

      </div>
`;

export default class MostCommentedListView extends AbstractView {
  get template() {
    return createNewMostCommentedListTemplate();
  }
}

