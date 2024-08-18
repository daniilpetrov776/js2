import AbstractView from '../framework/view/abstract-view.js';

const createNewPopupCommentsListTemplate = () => ('<ul class="film-details__comments-list">');

export default class PopupCommentsView extends AbstractView {
  get template() {
    return createNewPopupCommentsListTemplate();
  }
}
