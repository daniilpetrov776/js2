import AbstractView from '../framework/view/abstract-view.js';

const createNewPopupCommentContainerTemplate = () => (`<div class="film-details__bottom-container">

    </div>`);

export default class PopupCommentContainerView extends AbstractView {
  get template() {
    return createNewPopupCommentContainerTemplate();
  }
}
