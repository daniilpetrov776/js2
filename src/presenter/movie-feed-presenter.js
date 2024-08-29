import { remove, render } from '../framework/render.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import SortView from '../view/sort-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import EmptyFeedView from '../view/empty-feed-view.js';
import MoviePresenter from './movie-presenter.js';
import PopupPresenter from './popup-presenter.js';
import { updateItem } from '../utils/utils.js';
import { SortType } from '../utils/const.js';
import { sortByNewest, compareMoviesRating } from '../utils/tasks.js';

const MOVIES_PER_STEP = 5;
export default class MovieFeedPresenter {
  #films = new FilmsView();
  #filmsList = new FilmsListView();
  #filmsContainer = new FilmsContainerView();
  #loadMoreMoviesComponent = new ShowMoreButtonView();
  #sortComponent = null;
  #popupPresenter = null;
  #siteElement = null;
  #movieModel = null;
  #currentMovie = null;
  #currentSortType = SortType.DEFAULT;
  #sourcedMovies = [];

  #movies = [];
  #renderMoviesCount = MOVIES_PER_STEP;
  #moviePresenters = new Map();

  constructor (siteElement, movieModel) {
    this.#siteElement = siteElement;
    this.#movieModel = movieModel;
  }

  init = () => {
    this.#movies = [...this.#movieModel.get()];
    this.#sourcedMovies = [...this.#movieModel.get()];
    this.#renderSort();
    this.#renderFeed();
  };

  #handleMovieChange = (updatedMovie) => {
    this.#movies = updateItem(this.#movies, updatedMovie);
    this.#sourcedMovies = updateItem(this.#sourcedMovies, updatedMovie);
    this.#moviePresenters.get(updatedMovie.id).init(updatedMovie);

    if (this.#popupPresenter && this.#currentMovie.id === updatedMovie.id) {
      this.#popupPresenter.init(updatedMovie);
    }
  };

  #sortMovies = (sortType) => {
    switch (sortType) {
      case SortType.DATE:
        this.#movies.sort(sortByNewest);
        break;
      case SortType.RATING:
        this.#movies.sort(compareMoviesRating);
        break;
      default:
        this.#movies = [...this.#sourcedMovies];
    }
    this.#currentSortType = sortType;
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortMovies(sortType);
    this.#clearMovies();
    this.#clearSort();
    this.#renderSort();
    this.#renderMovies();
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    render(this.#sortComponent, this.#siteElement, 'afterbegin');
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderMovie = (movie) => {
    const moviePresenter = new MoviePresenter(this.#filmsContainer, this.#handleMovieChange, this.#addPopup);
    moviePresenter.init(movie);
    this.#moviePresenters.set(movie.id, moviePresenter);
  };

  #renderFeed = () => {
    this.#renderBaseStructure();
    this.#renderMovies();
  };

  #renderBaseStructure = () => {
    render(this.#films, this.#siteElement);
    render(this.#filmsList, this.#films.element);
    render(this.#filmsContainer, this.#filmsList.element);
  };

  #renderMovies = () => {
    const movieCount = Math.min(this.#movies.length, MOVIES_PER_STEP);
    this.#movies.slice(0, movieCount).forEach(this.#renderMovie);
    this.#checkAndRenderEmptyFeed();
    this.#renderloadMoreMoviesComponent();
  };

  #checkAndRenderEmptyFeed = () => {
    if (this.#movies.length === 0) {
      this.#renderEmptyFeed();
    }
  };

  #renderloadMoreMoviesComponent = () => {
    if (this.#movies.length > MOVIES_PER_STEP) {
      render(this.#loadMoreMoviesComponent, this.#siteElement);
      this.#loadMoreMoviesComponent.setClickHandler(this.#onShowMoreButtonClick);
    }
  };

  #onShowMoreButtonClick = () => {
    this.#movies
      .slice(this.#renderMoviesCount, this.#renderMoviesCount + MOVIES_PER_STEP)
      .forEach((movie) => this.#renderMovie(movie));

    this.#renderMoviesCount += MOVIES_PER_STEP;
    this.#removeShowMoreButton();
  };

  #removeShowMoreButton = () => {
    if (this.#renderMoviesCount >= this.#movies.length) {
      this.#loadMoreMoviesComponent.element.remove();
      this.#loadMoreMoviesComponent.removeElement();
    }
  };

  #renderEmptyFeed = () => {
    render(new EmptyFeedView(), this.#films.element);
  };

  #renderMoviePopup = () => {
    if (!this.#popupPresenter) {
      this.#popupPresenter = new PopupPresenter(this.#filmsContainer, this.#removeMoviePopup, this.#handleMovieChange);
      this.#popupPresenter.init(this.#currentMovie);
    }
  };

  #addPopup = (movie) => {
    //Если есть текущий фильм и если id текущего фильма строго не равен id фильма, то выполни код ниже.
    if (this.#currentMovie?.id !== movie.id) {
      this.#removeMoviePopup();
      this.#currentMovie = movie;
      this.#renderMoviePopup();
      document.body.classList.add('hide-overflow');
    }
  };

  #removeMoviePopup = () => {
    if (this.#popupPresenter) {
      this.#popupPresenter.destroy();
      this.#popupPresenter = null;
      this.#currentMovie = null;
      document.body.classList.remove('hide-overflow');
    }
  };

  #clearMovies = () => {
    this.#moviePresenters.forEach((presenter) => presenter.destroy());
    this.#moviePresenters.clear();
    this.#renderMoviesCount = MOVIES_PER_STEP;
    remove(this.#loadMoreMoviesComponent);
  };

  #clearSort = () => {
    remove(this.#sortComponent);
  };
}
