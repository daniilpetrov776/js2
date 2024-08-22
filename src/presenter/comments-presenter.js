import { render } from '../framework/render.js';
import CommentView from '../view/comment-view.js';
import PopupCommentsView from '../view/comments-list-view.js';
import PopupCommentContainerView from '../view/popup-comment-container-view.js';
import PopupCommentswrapperView from '../view/comments-wrapper-view.js';
import NewCommentView from '../view/new-comment-view.js';

export default class CommentsPresenter {
  #movie = null;
  #popupComponent = null;
  #commentComponent = null;
  #newCommentComponent = null;
  #commentContainer = null;
  #popupCommentsWrapperComponent = null;
  #popupCommentsListComponent = null;

  #comments = [];

  constructor (popupComponent) {
    this.#popupComponent = popupComponent;
  }

  init = (movie) => {
    this.#movie = movie;
    this.#commentContainer = new PopupCommentContainerView();
    this.#popupCommentsWrapperComponent = new PopupCommentswrapperView(movie);
    this.#popupCommentsListComponent = new PopupCommentsView();
    this.#newCommentComponent = new NewCommentView();
    this.#renderComments();
  };

  remove = () => {
    this.#popupCommentsWrapperComponent.element.remove();
    this.#popupCommentsWrapperComponent = null;
    if (this.#commentComponent) {
      this.#commentComponent.element.remove();
      this.#commentComponent = null;
    }
  };

  #renderComments = () => {
    this.#comments = this.#movie.comments;
    render(this.#commentContainer, this.#popupComponent.element);
    render(this.#popupCommentsWrapperComponent, this.#commentContainer.element);
    render(this.#popupCommentsListComponent,this.#popupCommentsWrapperComponent.element);
    render(this.#newCommentComponent, this.#popupCommentsWrapperComponent.element);

    for (let i = 0; i < this.#comments.length; i++) {
      this.#commentComponent = new CommentView(this.#comments[i]);
      render(this.#commentComponent, this.#popupCommentsListComponent.element);
    }
  };
}
