import { dateToY, minutesToTime } from '../utils/tasks.js';
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
  comments,
  userDetails: {
    watchlist,
    alreadyWatched,
    favorite,
  }} = movie;
  return (`<article class="film-card">
          <a class="film-card__link">
            <h3 class="film-card__title">${title}</h3>
            <p class="film-card__rating">${rating}</p>
            <p class="film-card__info">
              <span class="film-card__year">${dateToY(year)}</span>
              <span class="film-card__duration">${minutesToTime(duration)}</span>
              <span class="film-card__genre">${genre}</span>
            </p>
            <img src="${poster}" alt="" class="film-card__poster">
            <p class="film-card__description">${description}</p>
            <span class="film-card__comments">${comments.length} comments</span>
          </a>
          <div class="film-card__controls">
            <button class="
            film-card__controls-item
            film-card__controls-item--add-to-watchlist
            ${(watchlist) ? 'film-card__controls-item--active' : ''}" type="button">Add to watchlist</button>
            <button class="
            film-card__controls-item
            film-card__controls-item--mark-as-watched
            ${(alreadyWatched) ? 'film-card__controls-item--active' : ''}" type="button">Mark as watched</button>
            <button class="
            film-card__controls-item
            film-card__controls-item--favorite
            ${(favorite) ? 'film-card__controls-item--active' : ''}" type="button">Mark as favorite</button>
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
    this.element.querySelector('.film-card__poster').addEventListener('click', this.#movieClickHandler);
  };

  setWatchListClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchlistClickHandler);
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#watchedClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favorite = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  #movieClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favorite();

  };
}
