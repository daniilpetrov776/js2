import {EMOTIONS} from '../utils/const.js';

const createEmotionItem = (emotionItem) =>
  `
    <input
      class="film-details__emoji-item visually-hidden"
      name="comment-emoji"
      type="radio"
      id="emoji-${emotionItem}"
      value="${emotionItem}"
    >
    <label class="film-details__emoji-label" for="emoji-${emotionItem}" data-emotion="${emotionItem}">
      <img
        src="./images/emoji/${emotionItem}.png"
        width="30"
        height="30"
        alt="emoji"
      />
    </label>
  `;

const createCommentEmotion = (checkedEmotion) => {
  if (checkedEmotion !== null) {
    return `
    <img
    src="./images/emoji/${checkedEmotion }.png"
    width="55"
    height="55"
    alt="emoji"
  />`;
  } return '';
};

export const createPopupFormTemplate = (checkedEmotion, comment) =>
  `
    <form class="film-details__new-comment"  action="" method="get">
      <div class="film-details__add-emoji-label">
        ${createCommentEmotion(checkedEmotion)}
      </div>
      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input"
        placeholder="Select reaction below and write comment here"
        name="comment">${(comment) ? comment : ''}</textarea>
      </label>

      <div class="film-details__emoji-list">
        ${EMOTIONS.map(createEmotionItem).join('')}
      </div>
    </form>
  `;
