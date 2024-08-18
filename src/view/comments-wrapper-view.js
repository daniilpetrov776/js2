import AbstractView from '../framework/view/abstract-view.js';

const createNewPopupCommentsWrapperTemplate = (comments) => (`<section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
      </section>`);

export default class PopupCommentswrapperView extends AbstractView {
  constructor(movie) {
    super();
    this.movie = movie;
  }

  get template() {
    return createNewPopupCommentsWrapperTemplate(this.movie);
  }
}
