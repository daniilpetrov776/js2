import AbstractView from '../framework/view/abstract-view.js';
import { dateToRelativeTime } from '../utils/tasks.js';

const createNewCommentTemplate = (com) => {
  const {
    author,
    comment,
    date,
    emotion,
  } = com;
  return (`<li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-sleeping">
            </span>
            <div>
              <p class="film-details__comment-text">${comment}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${author}</span>
                <span class="film-details__comment-day">${dateToRelativeTime(date)}</span>
                <button class="film-details__comment-delete">Delete</button>
              </p>
            </div>
          </li>`);
};

export default class CommentView extends AbstractView {
  #comment = null;

  constructor(comment) {
    super();
    this.comment = comment;
  }

  get template() {
    return createNewCommentTemplate(this.comment);
  }
}
