import { dateToY } from '../utils.js';
import AbstractView from '../framework/view/abstract-view.js';

const createNewFilmTemplate = (movie) => {
  const {filmInfo: {
    description,
    duration,
    genre,
    poster,
    rating,
    title,
    year
  },
  comments} = movie;
  return (`<article class="film-card">
          <a class="film-card__link">
            <h3 class="film-card__title">${title}</h3>
            <p class="film-card__rating">${rating}</p>
            <p class="film-card__info">
              <span class="film-card__year">${dateToY(year)}</span>
              <span class="film-card__duration">${duration}</span>
              <span class="film-card__genre">${genre}</span>
            </p>
            <img src="${poster}" alt="" class="film-card__poster">
            <p class="film-card__description">${description}</p>
            <span class="film-card__comments">${comments.length} comments</span>
          </a>
          <div class="film-card__controls">
            <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
            <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
            <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
          </div>
        </article>
`);
};

export default class FilmView extends AbstractView {
  #task = null;

  constructor(task) {
    super();
    this.task = task;
  }

  get template() {
    return createNewFilmTemplate(this.task);
  }

  setMovieClickHandler = (callback) => {
    this._callback.click = callback;

    this.element.querySelector('.film-card__poster').addEventListener('click', this.#MovieclickHandler);
  };

  #MovieclickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}
